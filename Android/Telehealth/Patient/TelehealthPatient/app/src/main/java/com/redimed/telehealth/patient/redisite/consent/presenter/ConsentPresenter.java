package com.redimed.telehealth.patient.redisite.consent.presenter;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.FragmentActivity;
import android.util.Base64;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.AppointmentData;
import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.redisite.consent.view.IConsentView;
import com.redimed.telehealth.patient.utlis.UploadFileRequest;
import com.redimed.telehealth.patient.views.SignaturePad;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutionException;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedFile;

/**
 * Created by MeditekMini on 6/16/16.
 */
public class ConsentPresenter implements IConsentPresenter {

    private Gson gson;
    private Context context;
    private RegisterApi registerApi;
    private FragmentActivity activity;
    private IConsentView iConsentView;
    private ArrayList<EFormData> tempData;
    private SharedPreferences uidTelehealth;
    private String patientSignatureID, patientSignatureUID, path, eFormUID, nameEForm;
    private static final String TAG = "==CONSENT_PRESENTER==";

    protected MyApplication application;

    public ConsentPresenter(Context context, FragmentActivity activity, IConsentView iConsentView) {
        this.context = context;
        this.activity = activity;
        this.iConsentView = iConsentView;

        gson = new Gson();
        application = (MyApplication) context.getApplicationContext();
        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void uploadSignature(String path) {
        TypedFile typedFile = new TypedFile("multipart/form-data", new File(path));

        registerApi = RESTClient.getRegisterApiCore();
        registerApi.uploadFile(uidTelehealth.getString("userUID", ""), "Signature", typedFile, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, retrofit.client.Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {
                    patientSignatureID = jsonObject.get("fileInfo").getAsJsonObject().get("ID").getAsString();
                    patientSignatureUID = jsonObject.get("fileUID").getAsString();
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void saveSignature(SignaturePad signaturePad) {
        Bitmap signatureBitmap = signaturePad.getSignatureBitmap();
        if (addSignatureToGallery(signatureBitmap)) {
            iConsentView.onLoadImgSignature(signatureBitmap, path);
        }
    }

    private boolean addSignatureToGallery(Bitmap signature) {
        boolean result = false;
        try {
            File photo = new File(getAlbumStorageDir("SignaturePad"), String.format("Signature_%d.jpg", System.currentTimeMillis()));
            path = photo.getPath();
            saveBitmapToJPG(signature, photo);
            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            Uri contentUri = Uri.fromFile(photo);
            mediaScanIntent.setData(contentUri);
            context.sendBroadcast(mediaScanIntent);
            result = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    public File getAlbumStorageDir(String albumName) {
        // Get the directory for the user's public pictures directory.
        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), albumName);
        if (!file.mkdirs()) {
            Log.d("SignaturePad", "Directory not created");
        }
        return file;
    }

    public void saveBitmapToJPG(Bitmap bitmap, File photo) throws IOException {
        Bitmap newBitmap = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(newBitmap);
        canvas.drawColor(Color.WHITE);
        canvas.drawBitmap(bitmap, 0, 0, null);

        OutputStream stream = new FileOutputStream(photo);
        newBitmap.compress(Bitmap.CompressFormat.JPEG, 80, stream);

        stream.close();
    }

    private FileUpload[] listImageRequest(ArrayList<CustomGallery> customGalleries) {
        ArrayList<FileUpload> fileUploads = new ArrayList<>();
        for (int i = 0; i < customGalleries.size(); i++) {
            try {
                FileUpload fileUpload = new UploadFileRequest(customGalleries.get(i).sdcardPath, context).execute().get();
                fileUploads.add(fileUpload);
            } catch (InterruptedException | ExecutionException e) {
                e.getLocalizedMessage();
            }
        }
        //Convert list back to array
        FileUpload[] tempArray = new FileUpload[fileUploads.size()];
        return fileUploads.toArray(tempArray);
    }

    @Override
    public void submitRedisite(String supervisorName, Bundle bundle) {
        ArrayList<EFormData> eFormDatas = new ArrayList<>();
        if (bundle.getString("flagFragment").equalsIgnoreCase("injury")) {
            nameEForm = "Redisite Injury";
            eFormUID = "e060e666-6c51-4a19-8523-708d9242a2c0";

            eFormDatas.add(0, new EFormData("yes", "is_discuss", "field_2_26_0", "eform_input_check_checkbox", true, "row_2_26", 0));
            eFormDatas.add(1, new EFormData("yes", "is_claim", "field_2_27_0", "eform_input_check_checkbox", true, "row_2_27", 0));
            eFormDatas.add(2, new EFormData("yes", "is_third_party", "field_2_28_0", "eform_input_check_checkbox", true, "row_2_28", 0));
            eFormDatas.add(3, new EFormData("", "third_party_name", "field_2_28_2", "eform_input_text", "row_2_28", 0));
            eFormDatas.add(4, new EFormData("yes", "is_correct", "field_2_29_0", "eform_input_check_checkbox", true, "row_2_29", 0));
        } else {
            nameEForm = "Redisite General";
            eFormUID = "e81b4ec9-0442-4abf-a76f-b0808101c3f6'";

            eFormDatas.add(0, new EFormData("yes", "is_discuss", "field_2_20_0", "eform_input_check_checkbox", true, "row_2_20", 0));
            eFormDatas.add(1, new EFormData("yes", "is_claim", "field_2_21_0", "eform_input_check_checkbox", true, "row_2_21", 0));
            eFormDatas.add(2, new EFormData("yes", "is_third_party", "field_2_22_1", "eform_input_check_checkbox", true, "row_2_22", 0));
            eFormDatas.add(3, new EFormData("", "third_party_name", "field_2_22_3", "eform_input_text", "row_2_22", 0));
            eFormDatas.add(4, new EFormData("yes", "is_correct", "field_2_23_0", "eform_input_check_checkbox", true, "row_2_23", 0));
        }
        tempData = new ArrayList<>();
        tempData = Singleton.getInstance().getEFormDatas();
        tempData.addAll(Singleton.getInstance().getEFormPatient());
        tempData.addAll(eFormDatas);

        PatientAppointment patientAppointment = new PatientAppointment();
        for (EFormData eFormData : Singleton.getInstance().getEFormPatient()) {
            switch (eFormData.getName()) {
                case "p_title":
                    if (eFormData.isChecked())
                        patientAppointment.setTitle(eFormData.getValue());
                    break;
                case "p_firstname":
                    patientAppointment.setFirstName(eFormData.getValue());
                    break;
                case "p_lastname":
                    patientAppointment.setLastName(eFormData.getValue());
                    break;
                case "p_dob":
                    patientAppointment.setDOB(eFormData.getValue());
                    break;
                case "p_address":
                    patientAppointment.setAddress1(eFormData.getValue());
                    break;
                case "p_suburb":
                    patientAppointment.setSuburb(eFormData.getValue());
                    break;
                case "p_postcode":
                    patientAppointment.setPostcode(eFormData.getValue());
                    break;
                case "p_hm_phone":
                    patientAppointment.setHomePhoneNumber(eFormData.getValue());
                    break;
                case "p_mb_phone":
                    patientAppointment.setPhoneNumber(eFormData.getValue());
                    break;
                case "p_wk_phone":
                    patientAppointment.setWorkPhoneNumber(eFormData.getValue());
                    break;
                case "kin_name":
                    String nameKin = eFormData.getValue();
                    String firstNameKin = nameKin.equalsIgnoreCase("") ? "" : nameKin.substring(0, nameKin.indexOf(' '));
                    String lastNameKin =  nameKin.equalsIgnoreCase("") ? "" : nameKin.substring(nameKin.indexOf(' ') + 1);

                    patientAppointment.setPatientKinFirstName(firstNameKin);
                    patientAppointment.setPatientKinLastName(lastNameKin);
                    break;
                case "kin_phone":
                    patientAppointment.setPatientKinMobilePhoneNumber(eFormData.getValue());
                    break;
                default:
                    break;
            }
        }

        AppointmentData appointmentDataSite = new AppointmentData();
        appointmentDataSite.setSection("Telehealth");
        appointmentDataSite.setCategory("Appointment");
        appointmentDataSite.setType("RequestPatient");
        appointmentDataSite.setName("SiteID");
        appointmentDataSite.setValue("0");

        AppointmentData apptDataPatientSignID = new AppointmentData();
        apptDataPatientSignID.setSection("Telehealth");
        apptDataPatientSignID.setCategory("Appointment");
        apptDataPatientSignID.setType("RequestPatient");
        apptDataPatientSignID.setName("PatientSignatureID");
        apptDataPatientSignID.setValue(patientSignatureID);

        AppointmentData apptDataPatientSignUID = new AppointmentData();
        apptDataPatientSignUID.setSection("Telehealth");
        apptDataPatientSignUID.setCategory("Appointment");
        apptDataPatientSignUID.setType("RequestPatient");
        apptDataPatientSignUID.setName("PatientSignatureUID");
        apptDataPatientSignUID.setValue(patientSignatureUID);

        ArrayList<AppointmentData> appointmentDataArrayList = new ArrayList<>();
        appointmentDataArrayList.add(appointmentDataSite);
        appointmentDataArrayList.add(apptDataPatientSignID);
        appointmentDataArrayList.add(apptDataPatientSignUID);

        Appointment appointment = new Appointment();
        appointment.setType("Redisite");
        appointment.setPatientAppointment(patientAppointment);
        appointment.setAppointmentDatas(appointmentDataArrayList);
        appointment.setRequestDate(application.getCurrentDateSystem());
        appointment.setFileUploads(listImageRequest(Singleton.getInstance().getCustomGalleries()));

        List<Appointment> appointments = new ArrayList<>();
        appointments.add(appointment);

        JsonObject jAppointments = new JsonObject();
        jAppointments.addProperty("Appointments", gson.toJson(appointments, new TypeToken<List<Appointment>>(){}.getType()));

        JsonObject dataRequest = new JsonObject();
        dataRequest.add("data", jAppointments);

        for (EFormData eFormData : tempData) {
            Log.d(TAG, eFormData.getName() + " === " + eFormData.getValue() + " === " + eFormData.isChecked());
        }

        registerApi = RESTClient.getRegisterApiCore();
        registerApi.requestCompany(dataRequest, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {
                    String apptUID = jsonObject.get("data").getAsJsonArray().get(0).getAsJsonObject().get("appointment").getAsJsonObject().get("UID").getAsString();

                    JsonObject jEFormData = new JsonObject();
                    jEFormData.addProperty("name", nameEForm);
                    jEFormData.addProperty("templateUID", eFormUID);
                    jEFormData.addProperty("appointmentUID", apptUID);
                    jEFormData.addProperty("tempData", gson.toJson(tempData));
                    jEFormData.addProperty("userUID", uidTelehealth.getString("userUID", ""));
                    jEFormData.addProperty("patientUID", "3b784269-1377-4f17-99c3-cfb685cd601f");

                    registerApi = RESTClient.getRegisterApiEForm();
                    registerApi.submitRedisite(jEFormData, new Callback<JsonObject>() {
                        @Override
                        public void success(JsonObject jsonObject, Response response) {
                            application.replaceFragment(new HomeFragment());
                        }

                        @Override
                        public void failure(RetrofitError error) {
                            Log.d(TAG, error.getLocalizedMessage());
                        }
                    });
                }
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
    }

    public String covertBitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();

        return Base64.encodeToString(byteArray, Base64.DEFAULT);
    }
}
