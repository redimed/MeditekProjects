package patient.telehealth.redimed.workinjury.redisite.consent.presenter;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.jdeferred.Deferred;
import org.jdeferred.DoneCallback;
import org.jdeferred.FailCallback;
import org.jdeferred.Promise;
import org.jdeferred.impl.DeferredObject;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import butterknife.Bind;
import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.model.CustomGallery;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.AppointmentDataBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.PatientAppointmentBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.PatientsBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.FileUploadsBean;
import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelGeneral;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;
import patient.telehealth.redimed.workinjury.model.ModelPatient;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.redisite.consent.view.IConsentView;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.Key.Work;
import patient.telehealth.redimed.workinjury.utils.Key.Redisite;
import patient.telehealth.redimed.workinjury.views.SignaturePad;
import patient.telehealth.redimed.workinjury.widget.DialogLoading;
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
    private IConsentView iConsentView;
    private DialogLoading progressDialog;
    private String userUid;
    private static final String TAG = "==CONSENT_PRESENTER==";
    private ModelPatient modelPatient;
    private ModelCompany modelCompany;
    private boolean isAuthenticated;
    private boolean isTypeCompany;
    private String patientSignatureID, patientSignatureUID;


    @Bind(R.id.cbConsent1) CheckBox cbConsent1;
    @Bind(R.id.cbConsent2) CheckBox cbConsent2;
    @Bind(R.id.txtSupervisor) EditText txtSupervisor;
    @Bind(R.id.cbConsent3) CheckBox cbConsent3;
    @Bind(R.id.cbConsent4) CheckBox cbConsent4;


    /* Signature */
    @Bind(R.id.signaturePad) SignaturePad signaturePad;
    @Bind(R.id.vfContainer) ViewFlipper vfContainer;
    @Bind(R.id.lblClear) TextView btnClear;
    @Bind(R.id.lblSave) TextView btnSave;
    @Bind(R.id.layoutSubmit) LinearLayout layoutSubmit;
    @Bind(R.id.imgSignature) ImageView imgSignature;
    @Bind(R.id.lblComplete) TextView btnComplete;



    protected MyApplication application;

    public ConsentPresenter(Context context, IConsentView iConsentView) {
        this.context = context;
        this.iConsentView = iConsentView;

        gson = new Gson();
        progressDialog = new DialogLoading(context);
        application = (MyApplication) context.getApplicationContext();
        userUid = String.valueOf(application.getDataSharedPreferences(Key.useruid, Key.defalt));
        modelPatient = application.getDataModelPatient();
        modelCompany = application.getDataModelCompany();
        isAuthenticated = (boolean) application.getDataSharedPreferences(Key.isAuthenticated, false);
        isTypeCompany = (boolean) application.getDataSharedPreferences(Key.isTypeCompany, false);
    }

    public File getAlbumStorageDir(String albumName) {
        // Get the directory for the user's public pictures directory.
        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), albumName);
        boolean success = true;
        if (!file.exists()) {
            success = file.mkdir();
        }
        if (success) {

            Log.d("SignaturePad", "Directory created");
        } else {
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

    private void uploadSignature(String path, final Bitmap signatureBitmap) {
        TypedFile typedFile = new TypedFile("multipart/form-data", new File(path));
        try {
            RESTClient.getCoreApi().uploadFile(userUid, "Signature", typedFile, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, retrofit.client.Response response) {
                    String status = jsonObject.get("status").getAsString();
                    if (status.equalsIgnoreCase("success")) {
                        patientSignatureID = jsonObject.get("fileInfo").getAsJsonObject().get("ID").getAsString();
                        patientSignatureUID = jsonObject.get("fileUID").getAsString();
                        iConsentView.onLoadImgSignature(signatureBitmap);
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    iConsentView.onLoadError(error.getMessage());
                }
            });
        }catch (Exception e){
            Log.d(TAG, e.getMessage());
        }
    }

    @Override
    public void uploadSignature(SignaturePad signaturePad) {
        File filePhoto = addSignatureToGallery(signaturePad.getSignatureBitmap());
        if (filePhoto != null) {
            uploadSignature(filePhoto.getPath(), signaturePad.getSignatureBitmap());
        }
    }

    private File addSignatureToGallery(Bitmap signature) {
        File photo = null;
        try {
            photo = new File(getAlbumStorageDir("SignaturePad"), String.format("Signature_%d.jpg", System.currentTimeMillis()));
            saveBitmapToJPG(signature, photo);
            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            Uri contentUri = Uri.fromFile(photo);
            mediaScanIntent.setData(contentUri);
            context.sendBroadcast(mediaScanIntent);
            return photo;
        } catch (IOException e) {
            Log.d(TAG, e.getLocalizedMessage());
            return photo;
        }
    }

    private Promise uploadImageRequest(final ArrayList<CustomGallery> customGalleries) {
        final Deferred deferred = new DeferredObject();
        final List<FileUploadsBean> list = new ArrayList<>();
        final int[] j = {0};
        for (int i = 0; i < customGalleries.size(); i++) {
            try {
                Promise promiseUpload = application.UploadFile(customGalleries.get(i).sdcardPath, Key.medicalImage , userUid);
                    promiseUpload.then(new DoneCallback() {
                        @Override
                        public void onDone(Object result) {
                        j[0] = j[0] + 1;
                        JsonObject object = (JsonObject) result;
                        String fileUid = object.get("fileUID").getAsString();
                        FileUploadsBean file = new FileUploadsBean();
                        file.setUID(fileUid);

                        list.add(file);
                        if (j[0] == customGalleries.size()){
                            deferred.resolve(list);
                        }
                    }
                }, new FailCallback() {
                    @Override
                    public void onFail(Object result) {
                        j[0] = j[0] + 1;
                        if (j[0] == customGalleries.size()){
                            deferred.resolve(list);
                        }
                    }
                });
            } catch (Exception e) {
                //deferred.reject(e.getMessage());
            }
        }
        return deferred.promise();
    }

    @Override
    public Promise submitRedisite() {
        final Deferred deferred = new DeferredObject();




        uploadImageRequest(application.getCustomGalleries()).then(new DoneCallback() {
            @Override
            public void onDone(Object result) {
                List<FileUploadsBean> listFile = (List<FileUploadsBean>) result;
                if (listFile.size() == application.getCustomGalleries().size()) {
                    sendAppointmentCompany(listFile).then(new DoneCallback() {
                        @Override
                        public void onDone(Object result) {
                            sendEform(result).then(new DoneCallback() {
                                @Override
                                public void onDone(Object result) {
                                    deferred.resolve(result);
                                }
                            }, new FailCallback() {
                                @Override
                                public void onFail(Object result) {
                                    deferred.reject(result);
                                }
                            });
                        }
                    }, new FailCallback() {
                        @Override
                        public void onFail(Object result) {
                            deferred.reject(null);
                        }
                    });
                } else {
                    deferred.reject(null);
                    iConsentView.onLoadError("Upload Image Fails");
                }
            }
        }, new FailCallback() {
            @Override
            public void onFail(Object result) {
                deferred.reject(result);
            }
        });

        return deferred.promise();
    }

    public Promise sendEform(Object result){
        final Deferred deferred = new DeferredObject();

        JsonObject object = (JsonObject) result;
        String appUID = object.get(Redisite.data).getAsJsonArray().get(0).getAsJsonObject().get(Redisite.appointment).getAsJsonObject().get(Redisite.UID).getAsString();
        String patientUID = (String) application.getDataSharedPreferences(Key.patientUid, Key.defalt);
        String userUID = (String) application.getDataSharedPreferences(Key.useruid, Key.defalt);
        String templateUID = null;
        String nameRedisite = null;

        if (isTypeCompany) {
            patientUID = modelPatient.getUID();
        }


        if (application.getTempDataInjury().size() > 0){
            templateUID = Redisite.templateInjuryUID;
            nameRedisite = Redisite.nameInjuryRedisite;
        }

        if (application.getTempDataIllness().size() > 0){
            templateUID = Redisite.templateIllnessUID;
            nameRedisite = Redisite.nameIllnessRedisite;
        }

        List<TempDataBean> dataBean = new ArrayList<>();
        dataBean.addAll(application.getTempDataPatientList());
        dataBean.addAll(application.getTempDataInjury());
        dataBean.addAll(application.getTempDataIllness());
        dataBean.addAll(application.getTempDataConsent());

        ModelGeneral modelGeneral = new ModelGeneral();
        modelGeneral.setTempData(new Gson().toJson(dataBean));
        modelGeneral.setAppointmentUID(appUID);
        modelGeneral.setPatientUID(patientUID);
        modelGeneral.setUserUID(userUID);
        modelGeneral.setTemplateUID(templateUID);
        modelGeneral.setName(nameRedisite);

        JsonObject data = new Gson().toJsonTree(modelGeneral).getAsJsonObject();

        RESTClient.getEFormApi().submitRedisite(data, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                deferred.resolve(jsonObject);
            }

            @Override
            public void failure(RetrofitError error) {
                deferred.reject(error);
            }
        });

        return deferred.promise();
    }



    public Promise sendAppointmentCompany(List<FileUploadsBean> listFile){
        final Deferred deferred = new DeferredObject();

        PatientAppointmentBean patient = new PatientAppointmentBean();
        patient.setFirstName(modelPatient.getFirstName());
        patient.setLastName(modelPatient.getLastName());
        patient.setPhoneNumber(modelPatient.getHomePhoneNumber());
        patient.setDOB(modelPatient.getDOB());
        patient.setEmail1(modelPatient.getEmail1());

        List<AppointmentsBean.AppointmentDataBean> listData = new ArrayList<>();
        listData.add(setData(Key.patientSignatureID, patientSignatureID));
        listData.add(setData(Key.patientSignatureUID, patientSignatureUID));

        List<PatientsBean> listPatientUID = new ArrayList<>();


        if (!isTypeCompany) {
            listPatientUID.add(setPatient(String.valueOf(application.getDataSharedPreferences(Key.patientUid, Key.defalt))));
        }

        if (isTypeCompany) {
            listData.add(setData(Work.companyName, String.valueOf(application.getDataSharedPreferences(Key.companyName, Key.defalt))));
            listData.add(setData(Work.companyPhoneNumber, String.valueOf(modelCompany.getContactName())));
            listData.add(setData(Work.contactPerson, String.valueOf(modelCompany.getHomePhoneNumber())));

            listPatientUID.add(setPatient(modelPatient.getUID()));
        }

        AppointmentsBean appointment = new AppointmentsBean();
        appointment.setType(Key.rediSite);
        appointment.setRequestDate(new SimpleDateFormat(Key.dateFormat).format(new Date()));
        appointment.setPatientAppointment(patient);
        appointment.setAppointmentData(listData);
        appointment.setPatients(listPatientUID);
        appointment.setFileUploads(listFile);

        List<AppointmentsBean> listAppt = new ArrayList<>();
        listAppt.add(appointment);

        ModelAppointmentCompany modelAppointmentCompany = new ModelAppointmentCompany();

        modelAppointmentCompany.setAppointments(listAppt);

        MakeAppointmentCompany(modelAppointmentCompany).then(new DoneCallback() {
            @Override
            public void onDone(Object result) {
                deferred.resolve(result);
            }
        }, new FailCallback() {
            @Override
            public void onFail(Object result) {
                deferred.reject(result);
            }
        });

        return deferred.promise();
    }

    private PatientsBean setPatient(String UID){
        PatientsBean patient = new PatientsBean();
        patient.setUID(UID);
        return patient;
    }

    private AppointmentDataBean setData(String name, String value) {
        AppointmentDataBean data  = new AppointmentDataBean();
        data.setName(name);
        data.setType(Work.requestPatient);
        data.setCategory(Work.appointment);
        data.setSection(Work.telehealth);
        data.setValue(value);
        return data;
    }

    public Promise MakeAppointmentCompany(ModelAppointmentCompany modelAppointmentCompany) {
        final Deferred deferred = new DeferredObject();
        String[] data = {Key.Company.data, gson.toJson(modelAppointmentCompany)};
        RESTClient.getCoreApi().makeAppointmentCompany(application.createJson(data), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject object, Response response) {
                deferred.resolve(object);
            }

            @Override
            public void failure(RetrofitError error) {
                deferred.reject(error);
            }
        });
        return deferred.promise();
    }
}
