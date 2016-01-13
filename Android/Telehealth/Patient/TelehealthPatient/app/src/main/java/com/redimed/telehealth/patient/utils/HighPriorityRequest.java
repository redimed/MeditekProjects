package com.redimed.telehealth.patient.utils;

import android.content.SharedPreferences;
import android.graphics.Bitmap;
import com.android.volley.AuthFailureError;
import com.android.volley.Response;
import com.android.volley.toolbox.ImageRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by LamNguyen on 1/6/2016.
 */
public class HighPriorityRequest extends ImageRequest {

    private SharedPreferences telehealthPatient;

    public HighPriorityRequest(String url,
                               Response.Listener<Bitmap> listener, int maxWidth, int maxHeight, Bitmap.Config decodeConfig,
                               Response.ErrorListener errorListener, SharedPreferences telehealthPatient) {
        super(url, listener, maxWidth, maxHeight, decodeConfig, errorListener);
        this.telehealthPatient = telehealthPatient;
    }

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        HashMap<String, String> headers = new HashMap<String, String>();
        headers.put("AppID", "com.redimed.telehealth.patient");
        headers.put("Authorization", "Bearer " + telehealthPatient.getString("token", ""));
        headers.put("Content-Type", "application/json; charset=utf-8");
        headers.put("Cookie", telehealthPatient.getString("cookie", ""));
        headers.put("DeviceID", telehealthPatient.getString("deviceID", ""));
        headers.put("SystemType", "ARD");
        return headers;
    }

    @Override
    public Priority getPriority() {
        return Priority.IMMEDIATE;
    }
}
