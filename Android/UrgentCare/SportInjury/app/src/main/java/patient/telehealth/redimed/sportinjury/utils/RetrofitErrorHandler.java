package patient.telehealth.redimed.sportinjury.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import org.json.JSONObject;

import java.net.SocketTimeoutException;

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
            if (cause.getCause() instanceof SocketTimeoutException){
                errorDescription = "Network Timeout";
            } else {
                errorDescription = "Please check connection. Thank you!";
            }
        } else {
            if (cause.getResponse() == null) {
                errorDescription = "No Response From Server";
            }
            else {
                try {
                    ErrorResponse errorResponse = (ErrorResponse) cause.getBodyAs(ErrorResponse.class);
                    errorDescription = errorResponse.error.data.message;
                } catch (Exception ex) {
                    try {
                        String json = new String(((TypedByteArray) cause.getResponse().getBody()).getBytes());
                        JSONObject dataObject = new JSONObject(json);
                        errorDescription = dataObject.optString("ErrorsList");
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
