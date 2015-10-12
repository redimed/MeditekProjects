package com.redimed.telehealth.patient.fragment;


import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;

import java.util.HashMap;
import java.util.Map;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class HomeFragment extends Fragment implements View.OnClickListener {

    @Bind(R.id.imgBtnInformation)
    ImageButton imgBtnInformation;
    @Bind(R.id.imgBtnTelehealth)
    ImageButton imgBtnTelehealth;
    @Bind(R.id.imgBtnFAQ)
    ImageButton imgBtnFAQ;
    @Bind(R.id.imgBtnContact)
    ImageButton imgBtnContact;
    private String TAG = "HOME";
    private View v;
    private RegisterApi restClient;
    private String sessionID, token, apiKey;
    private boolean shouldFinish = false;

    public HomeFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        v = inflater.inflate(R.layout.fragment_home, container, false);
        ButterKnife.bind(this, v);
        restClient = RESTClient.getRegisterApi();

        imgBtnInformation.setOnClickListener(this);
        imgBtnFAQ.setOnClickListener(this);
        imgBtnContact.setOnClickListener(this);

        return v;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.imgBtnInformation:
                InformationPatient();
                break;
            case R.id.imgBtnFAQ:
                break;
            case R.id.imgBtnContact:
                break;
        }
    }

    private void InformationPatient() {
        Log.d(TAG, "INFORMATION");
    }

    private void GenerationSession() {
        restClient.generateSession(new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {
                    sessionID = jsonObject.getAsJsonObject("data").get("sessionId").getAsString();
                    token = jsonObject.getAsJsonObject("data").get("token").getAsString();
                    apiKey = jsonObject.getAsJsonObject("data").get("apiKey").getAsString();
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d("Error", error.toString());
            }
        });
    }

    private void CallActivity() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", "65defa35-c95a-4096-a5c9-19ec23d21c72");
        params.put("to", "115cd288-d08b-4e52-bf8c-48a7b544b3a7");
        params.put("message", "call");
        params.put("sessionId", sessionID);
        try {
            SocketService.sendData("socket/messageTransfer", params);
            startActivity(new Intent(v.getContext(), CallActivity.class));
            Toast.makeText(v.getContext(), "Clinic: " + params.toString(), Toast.LENGTH_LONG).show();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK){
                    if (!shouldFinish){
                        Toast.makeText(v.getContext(), R.string.confirm_exit, Toast.LENGTH_SHORT).show();
                        shouldFinish = true;
                        return false;
                    }
                }
                return false;
            }
        });
    }
}
