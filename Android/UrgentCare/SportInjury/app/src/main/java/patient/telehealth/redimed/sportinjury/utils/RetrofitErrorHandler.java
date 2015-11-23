package patient.telehealth.redimed.sportinjury.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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
                        errorDescription = HandlerError(dataObject);
                    } catch (Exception ex2) {
                        Log.e(TAG, "HandleError: " + ex2.getLocalizedMessage());
                        errorDescription = "Error Unknown";
                    }
                }
            }
        }
        return new Exception(errorDescription);
    }

    private String HandlerError(JSONObject dataObject) {
        String errorMsg = null, key, rule, msg;
        List<String> errorList = new ArrayList<String>();
        try {
            errorMsg = dataObject.getJSONObject("error").optString("error");
            if (errorMsg.equals("E_VALIDATION")) {
                errorMsg = " ";
                JSONObject invalidAttributes = dataObject.getJSONObject("error").optJSONObject("invalidAttributes");
                Iterator keys = invalidAttributes.keys();
                while (keys.hasNext()) {
                    key = (String)keys.next();
                    JSONArray field = invalidAttributes.getJSONArray(key);
                    for (int i = 0; i < field.length(); i++) {
                        JSONObject jsonObject = field.getJSONObject(i);
                        rule = jsonObject.getString("rule");
                        msg = jsonObject.getString("message");
                        Log.d(TAG, "Error: " + key + " === " + rule + " === " + msg);
                        errorList.add((key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase()) + " " + rule.toLowerCase() + ".\n");
                    }
                }
                for (int i = 0; i <= errorList.size(); i++){
                    errorMsg = errorMsg + errorList.get(i);
                }
            }
            else if (errorMsg.equals("E_UNKNOWN")){
                errorMsg = "Server Error";
            }
        } catch (Exception e) {
            Log.d(TAG, "Error: " + e.getLocalizedMessage());
        }
        return errorMsg;
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
