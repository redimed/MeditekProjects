package com.redimed.telehealth.patient.utlis;

import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.widget.ProgressBar;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.model.view.IModelView;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.RESTClient;

import java.io.File;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/20/2016.
 */
public class UploadFileModel extends AsyncTask<Integer, Integer, Void> {

    private Gson gson;
    private ProgressBar pb;
    private long totalSize = 0;
    private IModelView iModelView;
    private SharedPreferences uidTelehealth;
    private RegisterApi registerApiCore, registerApi;
    private CountingTypedFile.ProgressListener listener;
    private String TAG = "UPLOAD_PROGRESS", bodyPart, picturePath, appointmentUID;

    public UploadFileModel(ProgressBar pb, String picturePath, String appointmentUID, String bodyPart, SharedPreferences uidTelehealth, IModelView iModelView) {
        this.pb = pb;
        this.picturePath = picturePath;
        this.appointmentUID = appointmentUID;
        this.bodyPart = bodyPart;
        this.uidTelehealth = uidTelehealth;
        this.iModelView = iModelView;

        gson = new Gson();
        registerApi = RESTClient.getRegisterApi();
        registerApiCore = RESTClient.getRegisterApiCore();
    }

    @Override
    protected Void doInBackground(Integer... params) {

        String description = "";
        String fileType = "MedicalImage";
        String userUID = uidTelehealth.getString("userUID", "");
        File file = new File(picturePath);
        // TODO: 12/8/2015 Rotate image upload
        totalSize = file.length();

        listener = new CountingTypedFile.ProgressListener() {
            @Override
            public void transferred(long num) {
                publishProgress((int) ((num / (float) totalSize) * 100));
            }
        };

        registerApiCore.uploadFileModel(userUID, fileType, bodyPart, description, new CountingTypedFile("image/*", file, listener), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {

                    FileUpload fileUpload = new FileUpload();
                    fileUpload.setFileUID(jsonObject.get("fileUID").getAsString());
                    fileUpload.setApptUID(appointmentUID);

                    JsonObject fileJson = new JsonObject();
                    fileJson.addProperty("data", gson.toJson(fileUpload));
                    updateAppointment(fileJson);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iModelView.onResultUpload(error.getLocalizedMessage());
            }
        });
        return null;
    }

    private void updateAppointment(JsonObject fileJson) {
        registerApi.addAppointmentFile(fileJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {
                    iModelView.onResultUpload(status);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iModelView.onResultUpload(error.getLocalizedMessage());
            }
        });
    }

    @Override
    protected void onProgressUpdate(Integer... values) {
        int progress = values[0];
        pb.setProgress(progress);
    }
}
