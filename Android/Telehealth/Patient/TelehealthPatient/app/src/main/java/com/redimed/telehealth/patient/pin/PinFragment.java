package com.redimed.telehealth.patient.pin;


import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.pin.presenter.IPinPresenter;
import com.redimed.telehealth.patient.pin.presenter.PinPresenter;
import com.redimed.telehealth.patient.pin.view.IPinView;
import com.redimed.telehealth.patient.setting.SettingFragment;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

public class PinFragment extends Fragment implements IPinView {

    private Context context;
    private Fragment fragment;
    private IPinPresenter iPinPresenter;
    private SweetAlertDialog progressDialog;
    private static final String TAG = "=====PIN=====";

    @Bind(R.id.layoutChangePin)
    LinearLayout layoutChangePin;
//    @Bind(R.id.txtCurrentPin)
//    EditText txtCurrentPin;
//    @Bind(R.id.txtNewPin)
//    EditText txtNewPin;
//    @Bind(R.id.txtConfirmPin)
//    EditText txtConfirmPin;

    @Bind(R.id.btnSubmit)
    Button btnSubmit;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;

    public PinFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        final View v = inflater.inflate(R.layout.fragment_pin, container, false);
        setHasOptionsMenu(true);
        context = v.getContext();
        ButterKnife.bind(this, v);

        init(v);

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                progressDialog.show();
                btnSubmit.setEnabled(false);
                iPinPresenter.checkDataField(layoutChangePin);
            }
        });

        return v;
    }

    private void init(View v) {

        iPinPresenter = new PinPresenter(this, context, getActivity());
        iPinPresenter.initToolbar(toolBar);
        iPinPresenter.hideKeyboardFragment(v);

        //init progressDialog
        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#B42047"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                fragment = new SettingFragment();
                fragment.setArguments(getArguments());
                iPinPresenter.changeFragment(fragment);
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onLoadSuccess() {
        progressDialog.dismiss();
        iPinPresenter.changeFragment(new HomeFragment());
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
                    .setContentText(getResources().getString(R.string.token_expired))
                    .show();
        } else {
            new SweetAlertDialog(context, SweetAlertDialog.ERROR_TYPE)
                    .setContentText(msg)
                    .show();
        }
        progressDialog.dismiss();
        btnSubmit.setEnabled(true);
    }

    @Override
    public void onResultField(EditText editText) {
        progressDialog.dismiss();
        btnSubmit.setEnabled(true);
        editText.setError(getResources().getString(R.string.error_pin));
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        if (getView() != null) {
            getView().setFocusableInTouchMode(true);
            getView().requestFocus();
            getView().setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                        fragment = new SettingFragment();
                        fragment.setArguments(getArguments());
                        iPinPresenter.changeFragment(fragment);
                        return true;
                    }
                    return false;
                }
            });
        }
    }
}
