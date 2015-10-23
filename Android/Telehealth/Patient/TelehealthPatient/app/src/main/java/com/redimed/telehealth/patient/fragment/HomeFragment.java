package com.redimed.telehealth.patient.fragment;


import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.network.RESTClient;

import butterknife.Bind;
import butterknife.ButterKnife;

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
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
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
                ((MainActivity)v.getContext()).Display(1);
                break;
            case R.id.btnTelehealth:
                ((MainActivity)v.getContext()).Display(2);
                break;
            case R.id.btnFAQ:
                ((MainActivity)v.getContext()).Display(3);
                break;
            case R.id.btnContact:
                Contact();
                break;
        }
    }

    private void Contact(){
        Log.d(TAG, "CALL");
        String number = "+841267146714";
        Uri call = Uri.parse("tel:" + number);
        Intent phoneCallIntent = new Intent(Intent.ACTION_CALL, call);
        startActivity(phoneCallIntent);
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
                        return true;
                    }
                }
                return false;
            }
        });
    }
}
