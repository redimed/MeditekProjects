package com.redimed.telehealth.patient.request;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.TableLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.request.presenter.IRequestPresenter;
import com.redimed.telehealth.patient.request.presenter.RequestPresenter;
import com.redimed.telehealth.patient.request.view.IRequestView;
import com.redimed.telehealth.patient.utlis.AdapterImageRequest;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class RequestFragment extends Fragment implements IRequestView, View.OnClickListener, View.OnFocusChangeListener {

    private Context context;
    private boolean isImage = false;
    private ArrayList<EditText> arrEditText;
    private ArrayList<CustomGallery> customGalleries;
    private IRequestPresenter iRequestPresenter;
    private String TAG = "REQUEST";

    @Bind(R.id.tblRequest)
    TableLayout tblRequest;
    @Bind(R.id.txtFirstName)
    EditText txtFirstName;
    @Bind(R.id.txtLastName)
    EditText txtLastName;
    @Bind(R.id.txtMobile)
    EditText txtMobile;
    @Bind(R.id.txtHome)
    EditText txtHome;
    @Bind(R.id.autoCompleteSuburb)
    AutoCompleteTextView autoCompleteSuburb;
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtEmail)
    EditText txtEmail;
    @Bind(R.id.txtDescription)
    EditText txtDescription;
    @Bind(R.id.lblSubmit)
    TextView btnSubmit;
    @Bind(R.id.rvRequestImage)
    RecyclerView rvRequestImage;

    /* Upload */
    @Bind(R.id.layoutUpload)
    RelativeLayout layoutUpload;
    @Bind(R.id.lblUpload)
    TextView btnUpload;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.btnBack)
    Button btnBack;

    public RequestFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_request, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);
        init();

        btnUpload.setOnClickListener(this);
        btnSubmit.setOnClickListener(this);
        txtDOB.setOnFocusChangeListener(this);

        iRequestPresenter = new RequestPresenter(context, this, getActivity());
        iRequestPresenter.loadJsonData();
        iRequestPresenter.hideKeyboardFragment(v);
        iRequestPresenter.loadDataInfoExists();

        return v;
    }

    void init() {
        customGalleries = new ArrayList<CustomGallery>();

        arrEditText = new ArrayList<EditText>();
        arrEditText.add(txtFirstName);
        arrEditText.add(txtLastName);
        arrEditText.add(txtMobile);
        arrEditText.add(txtDOB);
        arrEditText.add(txtEmail);
        arrEditText.add(txtHome);
        arrEditText.add(txtDescription);
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.res_title));
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iRequestPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    @Override
    public void onLoadSuburb(String[] suburbs) {
        ArrayAdapter adapter = new ArrayAdapter(context, android.R.layout.simple_list_item_1, suburbs);
        autoCompleteSuburb.setThreshold(1);
        autoCompleteSuburb.setAdapter(adapter);
    }

    @Override
    public void onResultField(EditText editText) {
        if (editText != null) {
            editText.requestFocus(); // Scrolls view to this field.
            editText.setError(getResources().getString(R.string.field_empty));
        }
    }

    @Override
    public void onResultMobile(boolean phone) {
        if (!phone) {
            txtMobile.setText("");
            txtMobile.requestFocus();
            txtMobile.setError(getResources().getString(R.string.phone_format));
        }
    }

    @Override
    public void onResultEmail(boolean email) {
        if (!email) {
            txtEmail.setText("");
            txtEmail.requestFocus();
            txtEmail.setError(getResources().getString(R.string.email_valid));
        }
    }

    @Override
    public void onResultSuburb(boolean suburb) {
        if (!suburb) {
            autoCompleteSuburb.setText("");
            autoCompleteSuburb.requestFocus();
            autoCompleteSuburb.setError(getResources().getString(R.string.field_empty));
        }
    }

    @Override
    public void onLoadData(Patient[] patients) {
        if (patients != null) {
            layoutUpload.setVisibility(View.VISIBLE);
            btnUpload.setVisibility(View.VISIBLE);
            for (Patient patient : patients) {
                txtFirstName.setText(patient.getFirstName() == null ? "" : patient.getFirstName());
                txtLastName.setText(patient.getLastName() == null ? "" : patient.getLastName());
                txtMobile.setText(patient.getPhoneNumber() == null ? "" : patient.getPhoneNumber());
                txtDOB.setText(patient.getDOB() == null ? "" : patient.getDOB());
                txtEmail.setText(patient.getEmail() == null ? "" : patient.getEmail());
                autoCompleteSuburb.setText(patient.getSuburb() == null ? "" : patient.getSuburb());
                txtHome.setText(patient.getHomePhoneNumber() == null ? "" : patient.getHomePhoneNumber());
            }
        }
    }

    @Override
    public void onLoadGallery(ArrayList<CustomGallery> customGalleries) {
        this.customGalleries = customGalleries;

        AdapterImageRequest adapterImageRequest = new AdapterImageRequest(customGalleries, context);

        PreCachingLayoutManager layoutManagerCategories = new PreCachingLayoutManager(context);
        layoutManagerCategories.setOrientation(LinearLayoutManager.HORIZONTAL);
        layoutManagerCategories.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

        rvRequestImage.setLayoutManager(layoutManagerCategories);
        rvRequestImage.setAdapter(adapterImageRequest);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.lblUpload:
                Intent i = new Intent("ACTION_MULTIPLE_PICK");
                startActivityForResult(i, 200);
                break;
            case R.id.lblSubmit:
//                iRequestPresenter.checkDataField(tblRequest);
                iRequestPresenter.uploadImage(customGalleries, arrEditText, autoCompleteSuburb.getText().toString());
                break;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 200 && resultCode == Activity.RESULT_OK) {
            String[] allPath = data.getStringArrayExtra("all_path");
            iRequestPresenter.setImageGallery(allPath);
        }
    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        if (hasFocus) {
            txtDOB.setError(null);
            iRequestPresenter.displayDatePickerDialog();
        }
    }

    @Override
    public void onLoadDOB(String dob) {
        txtDOB.setText(dob);
    }

    @Override
    public void onErrorUpload(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(context, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
    }

    @Override
    public void onResultRequest(String msg) {
        if (msg.equalsIgnoreCase("success")) {
            iRequestPresenter.changeFragment(new HomeFragment());
        } else if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(context, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
    }

    //Handler back button
    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iRequestPresenter.changeFragment(new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
