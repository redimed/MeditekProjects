package com.redimed.telehealth.patient.utils;

import android.content.SharedPreferences;
import android.util.Log;

import com.android.volley.AuthFailureError;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by LamNguyen on 1/6/2016.
 */
public class HighPriorityRequest extends JsonObjectRequest {

    private SharedPreferences telehealthPatient;

    public HighPriorityRequest(int method, String url, JSONObject jsonRequest, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener,
                               SharedPreferences tele) {
        super(method, url, jsonRequest, listener, errorListener);
        this.telehealthPatient = tele;
    }

    public HighPriorityRequest(String url, JSONObject jsonRequest, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener) {
        super(url, jsonRequest, listener, errorListener);
    }

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        HashMap<String, String> headers = new HashMap<String, String>();
        headers.put("Content-Type", "application/json");
        headers.put("Authorization", "Bearer " + telehealthPatient.getString("token", ""));
        headers.put("DeviceID", telehealthPatient.getString("deviceID", ""));
        headers.put("SystemType", "ARD");
        headers.put("Cookie", telehealthPatient.getString("cookie", ""));
        headers.put("AppID", "com.redimed.telehealth.patient");
        return headers;
    }

    @Override
    public Priority getPriority() {
        return Priority.IMMEDIATE;
    }
}
