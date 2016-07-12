package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;

import com.google.gson.JsonParser;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.RESTClient;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.io.File;

/**
 * Created by MeditekPro on 7/1/16.
 */
public class UploadFileRequest extends AsyncTask<String, String, FileUpload> {

    private String pathImage;
    private SharedPreferences uidTelehealth;
    private static final String TAG = "=====UPLOAD=====";

    public UploadFileRequest(String path, Context context) {
        this.pathImage = path;
        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    protected final FileUpload doInBackground(String... params) {
        try {
            File sourceFile = new File(pathImage);
            MediaType MEDIA_TYPE = MediaType.parse("multipart/form-data");

            RequestBody requestBody = new MultipartBuilder()
                    .type(MultipartBuilder.FORM)
                    .addFormDataPart("userUID", uidTelehealth.getString("userUID", ""))
                    .addFormDataPart("fileType", "MedicalImage")
                    .addFormDataPart("uploadFile", pathImage, RequestBody.create(MEDIA_TYPE, sourceFile)).build();

            Request request = new Request.Builder()
                    .url(Config.apiURLCore + "/api/uploadFile")
                    .post(requestBody)
                    .build();

            OkHttpClient okHttpClient = new OkHttpClient();
            okHttpClient.interceptors().add(new RESTClient.RequestInterceptor());

            Response response = okHttpClient.newCall(request).execute();

            if (response.isSuccessful()) {
                String strBody = response.body().string();
                String strUID = new JsonParser().parse(strBody).getAsJsonObject().get("fileUID").getAsString();

                FileUpload fileUpload = new FileUpload();
                fileUpload.setUID(strUID);

                return fileUpload;
            } else
                return null;
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage());
            return null;
        }
    }
}
