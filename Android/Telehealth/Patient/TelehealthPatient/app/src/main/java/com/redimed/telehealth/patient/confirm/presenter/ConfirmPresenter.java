package com.redimed.telehealth.patient.confirm.presenter;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Environment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.widget.CheckBox;
import android.widget.ProgressBar;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.confirm.view.IConfirmView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.AppointmentData;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utlis.CountingTypedFile;
import com.redimed.telehealth.patient.views.SignaturePad;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedFile;

/**
 * Created by Fox on 3/2/2016.
 */
public class ConfirmPresenter implements IConfirmPresenter {

    private Gson gson;
    private Context context;
    private RegisterApi registerApi;
    private IConfirmView iConfirmView;
    private SharedPreferences uidTelehealth;
    private String pathSign = "", signatureUID;
    private static final String TAG = "===CONFIRM_PRESENTER===";

    public ConfirmPresenter(Context context, IConfirmView iConfirmView) {
        this.context = context;
        this.iConfirmView = iConfirmView;

        gson = new Gson();
        if (context.getSharedPreferences("ExistsUser", Context.MODE_PRIVATE).getBoolean("exists", false))
            uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public String getCurrentDateSystem() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("EEE, dd MMM yyyy 'at' HH:mm a", Locale.ENGLISH);
        return dateFormat.format(new Date());
    }

    @Override
    public void uploadNonLogin(String path) {
        registerApi = RESTClient.getRegisterApiCore();
        final TypedFile typedFile = new TypedFile("multipart/form-data", new File(path));

        registerApi.uploadFileNonLogin("2d0626f3-e741-11e5-8fab-0050569f3a15", "Signature", typedFile, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {
                    signatureUID = jsonObject.get("fileUID").getAsString();
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void saveBitmapSign(SignaturePad signaturePad) {
        Bitmap signatureBitmap = signaturePad.getSignatureBitmap();
        if (addSignatureToGallery(signatureBitmap)) {
            iConfirmView.onLoadImgSignature(signatureBitmap, pathSign);
        }
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

    private boolean addSignatureToGallery(Bitmap signature) {
        boolean result = false;
        try {
            File photo = new File(getAlbumStorageDir("SignaturePad"), String.format("Signature_%d.jpg", System.currentTimeMillis()));
            pathSign = photo.getPath();
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

    @Override
    public void completeRequest(Intent i, ArrayList<String> fileUploads, String currentDate) {
        PatientAppointment patientAppointment = new PatientAppointment();
        patientAppointment.setFirstName(i.getStringExtra("firstName"));
        patientAppointment.setLastName(i.getStringExtra("lastName"));
        patientAppointment.setPhoneNumber(i.getStringExtra("mobile"));
        patientAppointment.setHomePhoneNumber(i.getStringExtra("mobile"));
        patientAppointment.setDOB(i.getStringExtra("dob"));
        patientAppointment.setSuburb(i.getStringExtra("suburb"));
        patientAppointment.setEmail(i.getStringExtra("email"));

        makeRequest(patientAppointment, i.getStringExtra("des"), i.getStringExtra("apptType"), fileUploads, currentDate);
    }

    @Override
    public boolean isCheckPatientConsent(CheckBox checkBox1, CheckBox checkBox2, CheckBox checkBox3) {
        return checkBox1.isChecked() && checkBox2.isChecked() && checkBox3.isChecked();
    }

    private void makeRequest(PatientAppointment patientAppointment, String des, String apptType, ArrayList<String> fileUploads, String currentDate) {

        JsonObject jConsent1 = new JsonObject();
        jConsent1.addProperty("Section", "Telehealth");
        jConsent1.addProperty("Category", "Appointment");
        jConsent1.addProperty("Type", "RequestPatient");
        jConsent1.addProperty("Name", "PatientConsent1");
        jConsent1.addProperty("Value", "Y");

        JsonObject jConsent2 = new JsonObject();
        jConsent2.addProperty("Section", "Telehealth");
        jConsent2.addProperty("Category", "Appointment");
        jConsent2.addProperty("Type", "RequestPatient");
        jConsent2.addProperty("Name", "PatientConsent2");
        jConsent2.addProperty("Value", "Y");

        JsonObject jConsent3 = new JsonObject();
        jConsent3.addProperty("Section", "Telehealth");
        jConsent3.addProperty("Category", "Appointment");
        jConsent3.addProperty("Type", "RequestPatient");
        jConsent3.addProperty("Name", "PatientConsent3");
        jConsent3.addProperty("Value", "Y");

        JsonObject jConsent4 = new JsonObject();
        jConsent3.addProperty("Section", "Telehealth");
        jConsent3.addProperty("Category", "Appointment");
        jConsent3.addProperty("Type", "RequestPatient");
        jConsent3.addProperty("Name", "Signature");
        jConsent3.addProperty("Value", signatureUID);

        Log.d(TAG, signatureUID + "");

        ArrayList<AppointmentData> appointmentDataArrayList = new ArrayList<AppointmentData>();
        appointmentDataArrayList.add(gson.fromJson(jConsent1, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent2, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent3, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent4, AppointmentData.class));

        JsonObject jRequest = new JsonObject();
        jRequest.addProperty("RequestDate", parseCurrentDate(currentDate));
        jRequest.addProperty("Description", des);
        jRequest.addProperty("Type", apptType);
        jRequest.addProperty("PatientAppointment", gson.toJson(patientAppointment));
        jRequest.addProperty("AppointmentData", gson.toJson(appointmentDataArrayList));
        jRequest.addProperty("FileUploads", gson.toJson(fileUploads));

        JsonObject dataRequest = new JsonObject();
        dataRequest.addProperty("data", gson.toJson(jRequest));

        registerApi = RESTClient.getRegisterApi();
        registerApi.requestTelehealth(dataRequest, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                iConfirmView.onLoadSuccess();
            }

            @Override
            public void failure(RetrofitError error) {
                iConfirmView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    private String parseCurrentDate(String currentDate) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("EEE, dd MMM yyyy 'at' HH:mm a", Locale.ENGLISH);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z", Locale.ENGLISH);
        try {
            Date date = inputFormat.parse(currentDate);
            currentDate = simpleDateFormat.format(date);
        } catch (ParseException e) {
            Log.d(TAG, e.getLocalizedMessage());
        }
        return currentDate;
    }

    @Override
    public void loadSignature(String signUID) {
        this.signatureUID = signUID;
        String url = Config.apiURLDownload + signUID;
        GlideUrl glideUrl = new GlideUrl(url, new LazyHeaders.Builder()
                .addHeader("SystemType", "ARD")
                .addHeader("AppID", "com.redimed.telehealth.patient")
                .addHeader("Cookie", uidTelehealth.getString("cookie", ""))
                .addHeader("DeviceID", uidTelehealth.getString("deviceID", ""))
                .addHeader("Authorization", "Bearer " + uidTelehealth.getString("token", ""))
                .build());

        int myWidth = 300;
        int myHeight = 300;
        Glide.with(context).load(glideUrl)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        iConfirmView.onLoadImgSignature(resource, pathSign);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        Bitmap errorBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon_error_image);
                        iConfirmView.onLoadImgSignature(errorBitmap, pathSign);
                    }
                });
    }

}
