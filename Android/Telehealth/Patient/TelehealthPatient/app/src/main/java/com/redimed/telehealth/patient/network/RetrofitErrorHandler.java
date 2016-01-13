package com.redimed.telehealth.patient.network;

import android.content.Context;
import android.util.Log;

import org.json.JSONObject;

import java.io.InterruptedIOException;
import java.net.ConnectException;
import java.net.SocketTimeoutException;

import retrofit.ErrorHandler;
import retrofit.RetrofitError;
import retrofit.mime.TypedByteArray;

/**
 * Created by Lam on 10/20/2015.
 */
public class RetrofitErrorHandler implements ErrorHandler {

    private Context context;
    private String TAG = "RETROFIT_ERROR";

    public RetrofitErrorHandler(Context ctx) {
        context = ctx;
    }

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
                        if (strError.equalsIgnoreCase("[\"isAuthenticated.notAuthenticated\"]") || strError.equalsIgnoreCase("[\"isAuthenticated.oldRefreshCodeExpired\"]")){
                            errorDescription = "Sorry for inconvenience, please activation application again!";
                        }
                        else if (strError.equalsIgnoreCase("[\"isAuthenticated.sessionUserMismatchedUserAccess\"]")){
                            errorDescription = "Session Mismatched, please refresh again!";
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
