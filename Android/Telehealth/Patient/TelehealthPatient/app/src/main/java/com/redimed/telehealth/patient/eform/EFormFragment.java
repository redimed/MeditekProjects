package com.redimed.telehealth.patient.eform;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.WEBClient;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
@SuppressLint("SetJavaScriptEnabled")
public class EFormFragment extends Fragment {

    private SharedPreferences spTelehealth;
    private static final String TAG = "=====EFORM=====";

    @Bind(R.id.webEform)
    WebView webEform;

    public EFormFragment() {
        // Required empty public constructor

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        setHasOptionsMenu(true);
        View v = inflater.inflate(R.layout.fragment_eform, container, false);
        ButterKnife.bind(this, v);

        Context context = v.getContext();
        spTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);

        Bundle bundle = getArguments();
        if (bundle != null) {
            listEformPatient(String.valueOf(bundle.get("apptUID")));
        }
        return v;
    }

    private void listEformPatient(String apptUID) {
        String userUID = spTelehealth.getString("userUID", "");
        Log.d(TAG, apptUID + " = " + userUID);
        String url = Config.apiURLEFormClient + "/#/eform/appointment?apptUID=" + apptUID + "&userUID=" + userUID;

        webEform.getSettings().setUseWideViewPort(true);
        webEform.getSettings().setJavaScriptEnabled(true);
        webEform.getSettings().setLoadWithOverviewMode(true);
        webEform.setWebViewClient(new WEBClient());
        webEform.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
        webEform.loadUrl(url);
    }
}
