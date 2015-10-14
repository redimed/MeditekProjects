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
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.MainActivity;
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

    private String TAG = "HOME";
    private View v;
    private RegisterApi restClient;
    private boolean shouldFinish = false;

    @Bind(R.id.btnInformation)
    Button btnInformation;
    @Bind(R.id.btnTelehealth)
    Button btnTelehealth;
    @Bind(R.id.btnFAQ)
    Button btnFAQ;
    @Bind(R.id.btnContact)
    Button btnContact;

    public HomeFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        v = inflater.inflate(R.layout.fragment_home, container, false);
        ButterKnife.bind(this, v);
        restClient = RESTClient.getRegisterApi();

        btnInformation.setOnClickListener(this);
        btnTelehealth.setOnClickListener(this);
        btnFAQ.setOnClickListener(this);
        btnContact.setOnClickListener(this);

        return v;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnInformation:
                InformationPatient();
                break;
            case R.id.btnTelehealth:
                break;
            case R.id.btnFAQ:
                break;
            case R.id.btnContact:
                break;
        }
    }

    private void InformationPatient() {
        ((MainActivity)v.getContext()).Display(1);
        Log.d(TAG, "INFORMATION");
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
