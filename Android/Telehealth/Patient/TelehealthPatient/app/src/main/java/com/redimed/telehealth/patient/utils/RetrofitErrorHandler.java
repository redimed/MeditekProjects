package com.redimed.telehealth.patient.utils;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import com.redimed.telehealth.patient.LauncherActivity;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;

import org.json.JSONObject;

import java.io.InterruptedIOException;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.util.Timer;
import java.util.TimerTask;

import retrofit.ErrorHandler;
import retrofit.RetrofitError;
import retrofit.mime.TypedByteArray;

/**
 * Created by Lam on 10/20/2015.
 */
public class RetrofitErrorHandler implements ErrorHandler {

    private String TAG = "RETROFIT_ERROR";

    @Override
    public Throwable handleError(RetrofitError cause) {
        String errorDescription;

        if (cause.getKind().equals(RetrofitError.Kind.NETWORK)) {
            if (cause.getCause() instanceof SocketTimeoutException
                    || cause.getCause() instanceof InterruptedIOException
                    || cause.getCause() instanceof ConnectException) {
                errorDescription = "Network Timeout";
            } else {
                errorDescription = "Network Error";
            }
        } else {
            if (cause.getResponse() == null) {
                errorDescription = "No Response From Server";
            } else {
                try {
                    ErrorResponse errorResponse = (ErrorResponse) cause.getBodyAs(ErrorResponse.class);
                    errorDescription = errorResponse.error.data.message;
                } catch (Exception ex) {
                    try {
                        String json = new String(((TypedByteArray) cause.getResponse().getBody()).getBytes());
                        JSONObject dataObject = new JSONObject(json);
                        String strError = dataObject.optString("ErrorsList");
                        Log.d(TAG, strError);
                        if (strError.equalsIgnoreCase("[\"isAuthenticated.notAuthenticated\"]")){
                            errorDescription = "Sorry for inconvenience, please activation application again!";
                            new Timer().schedule(new TimerTask() {
                                @Override
                                public void run() {
                                    MyApplication.getInstance().clearApplication();
                                    Context context = MyApplication.getInstance().getApplicationContext();
                                    Intent i = new Intent(context, LauncherActivity.class);
                                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                    context.startActivity(i);
                                }
                            }, 2500);
                        }
                        else {
                            errorDescription = strError;
                        }
                    } catch (Exception ex2) {
                        Log.e(TAG, "HandleError: " + ex2.getLocalizedMessage());
                        errorDescription = "Error Unknown";
                    }
                }
            }
        }
        return new Exception(errorDescription);
    }

    private void Reconnect(){

    }
}

class ErrorResponse {
    Error error;

    public static class Error {
        Data data;

        public static class Data {
            String message;
        }
    }
}
