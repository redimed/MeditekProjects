package com.redimed.telehealth.patient.appointment;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.appointment.presenter.AppointmentPresenter;
import com.redimed.telehealth.patient.appointment.presenter.IAppointmentPresenter;
import com.redimed.telehealth.patient.appointment.view.IAppointmentView;
import com.redimed.telehealth.patient.model.ModelActivity;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.tracking.TrackingFragment;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;
import com.redimed.telehealth.patient.utlis.AdapterImageAppointment;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class AppointmentFragment extends Fragment implements IAppointmentView, View.OnClickListener {

    private Gson gson;
    private Context context;
    private boolean flagLayout = false;
    private Uri fileUri; //file to store image
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int RESULT_RELOAD = 3;
    private static final int MEDIA_TYPE_IMAGE = 1;
    private IAppointmentPresenter iAppointmentPresenter;
    private String fromTime, status, firstDoctor, middleDoctor, lastDoctor, type, appointmentUID;
    private static final String TAG = "=====DETAILS=====";

    @Bind(R.id.lblDate)
    TextView lblDate;
    @Bind(R.id.lblTime)
    TextView lblTime;
    @Bind(R.id.lblStatus)
    TextView lblStatus;
    @Bind(R.id.lblDoctorName)
    TextView lblDoctorName;
    @Bind(R.id.layoutStatus)
    LinearLayout layoutStatus;
    @Bind(R.id.btnUpload)
    TextView btnUpload;
    @Bind(R.id.rvImageAppointment)
    RecyclerView rvImageAppointment;
    @Bind(R.id.lblImage)
    TextView lblImage;

    @Bind(R.id.lblFirstName)
    TextView lblFirstName;
    @Bind(R.id.lblLastName)
    TextView lblLastName;
    @Bind(R.id.lblMobile)
    TextView lblMobile;
    @Bind(R.id.lblHome)
    TextView lblHome;
    @Bind(R.id.lblSuburb)
    TextView lblSuburb;
    @Bind(R.id.lblApptType)
    TextView lblApptType;
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.lblEmail)
    TextView lblEmail;
    @Bind(R.id.lblDes)
    TextView lblDes;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblSubTitle)
    TextView lblSubTitle;

    public AppointmentFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_appointment_details, container, false);
        this.context = v.getContext();
        ButterKnife.bind(this, v);
        initVariable();

        if (savedInstanceState != null) {
            fileUri = savedInstanceState.getParcelable("fileUri");
        }

        btnUpload.setOnClickListener(this);
        layoutStatus.setOnClickListener(this);

        return v;
    }

    private void initVariable() {
        gson = new Gson();
        iAppointmentPresenter = new AppointmentPresenter(context, this, getActivity());

        Bundle bundle = getArguments();
        if (bundle != null) {
            appointmentUID = bundle.getString("apptUID", "");
            iAppointmentPresenter.getAppointmentDetails(appointmentUID);
        }
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.appt_title));
        lblSubTitle.setText(getResources().getString(R.string.list_appt_title));
        layoutBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iAppointmentPresenter.changeFragment(new TrackingFragment());
            }
        });
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
            new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
                    .setContentText(msg)
                    .show();
        }
    }

    @Override
    public void onLoadAppointment(JsonObject dataAppt) {
        if (!dataAppt.get("data").isJsonNull()) {
            fromTime = dataAppt.get("data").getAsJsonObject().get("FromTime").isJsonNull() ?
                    "NONE" : dataAppt.get("data").getAsJsonObject().get("FromTime").getAsString();

            status = dataAppt.get("data").getAsJsonObject().get("Status").isJsonNull() ?
                    "NONE" : dataAppt.get("data").getAsJsonObject().get("Status").getAsString();

            type = dataAppt.get("data").getAsJsonObject().get("Type").isJsonNull() ?
                    "NONE" : dataAppt.get("data").getAsJsonObject().get("Type").getAsString();

            GetInfoPatient(dataAppt);

            lblStatus.setText(status);
            lblApptType.setText(type);
            lblDoctorName.setText(GetNameDoctor(dataAppt));
            lblDate.setText(MyApplication.getInstance().ConvertDate(fromTime));
            lblTime.setText(MyApplication.getInstance().ConvertTime(fromTime));

            iAppointmentPresenter.getListImage(dataAppt);
        } else {
            AlertDialog alertDialog = new AlertDialog.Builder(context).create();
            alertDialog.setTitle(R.string.title_dialog_appt);
            alertDialog.setMessage(context.getResources().getString(R.string.message_dialog_appt));

            alertDialog.setButton(DialogInterface.BUTTON_POSITIVE, "Close", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    iAppointmentPresenter.changeFragment(new TrackingFragment());
                }
            });
            alertDialog.show();
        }
    }

    private void GetInfoPatient(JsonObject dataAppt) {
        String patientAppt = dataAppt.get("data").getAsJsonObject().get("TelehealthAppointment").getAsJsonObject().get("PatientAppointment").toString();
        PatientAppointment patientAppointment = gson.fromJson(patientAppt, PatientAppointment.class);
        lblFirstName.setText(patientAppointment.getFirstName());
        lblLastName.setText(patientAppointment.getLastName());
        lblMobile.setText(patientAppointment.getPhoneNumber());
        lblHome.setText(patientAppointment.getHomePhoneNumber());
        lblSuburb.setText(patientAppointment.getSuburb());
        lblDOB.setText(patientAppointment.getDOB());
        lblEmail.setText(patientAppointment.getEmail());
    }

    private String GetNameDoctor(JsonObject dataAppt) {
        for (Doctor doctor : (gson.fromJson(dataAppt.get("data").getAsJsonObject().get("Doctors").toString(), Doctor[].class))) {
            firstDoctor = doctor.getFirstName() == null ? "NONE" : doctor.getFirstName();
            middleDoctor = doctor.getMiddleName() == null ? " " : doctor.getMiddleName();
            lastDoctor = doctor.getLastName() == null ? " " : doctor.getLastName();
        }
        return firstDoctor + middleDoctor + lastDoctor;
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().requestFocus();
        getView().setFocusableInTouchMode(true);
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iAppointmentPresenter.changeFragment(new TrackingFragment());
                    return true;
                }
                return false;
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.layoutStatus:
                iAppointmentPresenter.viewStatus(status, fromTime);
                break;
            case R.id.btnUpload:
                DialogUploadImage();
                break;
        }
    }

    //Display dialog choose camera or gallery to upload image
    private void DialogUploadImage() {
        AlertDialog alertDialog = new AlertDialog.Builder(context).create();
        alertDialog.setTitle("Choose an action");
        alertDialog.setMessage("Choose an action Camera or Gallery");

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Gallery", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent galleryIntent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(galleryIntent, RESULT_PHOTO);
            }
        });

        alertDialog.setButton(Dialog.BUTTON_POSITIVE, "Camera", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                fileUri = iAppointmentPresenter.getOutputMediaFileUri(MEDIA_TYPE_IMAGE);
                cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri);
                startActivityForResult(cameraIntent, RESULT_CAMERA);
            }
        });
        alertDialog.show();
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putParcelable("fileUri", fileUri);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        Cursor cursor;
        int columnIndex;
        String picturePath = "";
        try {
            getActivity();
            if (resultCode == Activity.RESULT_OK) {
                switch (requestCode) {
                    case RESULT_PHOTO:
                        //Get uri image
                        Uri selectedImage = data.getData();
                        String[] filePathColumn = {MediaStore.Images.Media.DATA};
                        //Get cursor
                        cursor = context.getContentResolver().query(selectedImage, filePathColumn, null, null, null);
                        assert cursor != null;
                        cursor.moveToFirst();
                        //Get path form cursor index
                        columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                        picturePath = cursor.getString(columnIndex);
                        cursor.close();
                        flagLayout = true;
                        break;

                    case RESULT_CAMERA:
                        // Downsizing image as it throws OutOfMemory Exception for larger images
                        picturePath = fileUri.getPath();
                        flagLayout = true;
                        break;

                    case RESULT_RELOAD:
                        flagLayout = false;
                        FragmentTransaction ft = getFragmentManager().beginTransaction();
                        ft.detach(this).attach(this).commit();
                        break;
                }
                if (flagLayout) {
                    Intent i = new Intent(context, ModelActivity.class);
                    i.putExtra("picturePath", picturePath);
                    i.putExtra("appointmentUID", appointmentUID);
                    startActivityForResult(i, RESULT_RELOAD);
                }
            } else {
                Toast.makeText(context, "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
    }

    @Override
    public void onResultUpload(String picturePath, boolean result) {
        if (flagLayout) {
            Intent i = new Intent(context, ModelActivity.class);
            i.putExtra("picturePath", picturePath);
            i.putExtra("appointmentUID", appointmentUID);
            startActivityForResult(i, RESULT_RELOAD);
        }
    }

    @Override
    public void onLoadListImage(List<String> listImage, SharedPreferences spTelehealth) {
        if (listImage != null && spTelehealth != null) {
            AdapterImageAppointment adapterImageAppointment = new AdapterImageAppointment(context, listImage, spTelehealth);

            PreCachingLayoutManager layoutManagerCategories = new PreCachingLayoutManager(context);
            layoutManagerCategories.setOrientation(LinearLayoutManager.HORIZONTAL);
            layoutManagerCategories.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

            rvImageAppointment.setLayoutManager(layoutManagerCategories);
            rvImageAppointment.setAdapter(adapterImageAppointment);
        }
        if (listImage.size() <= 0) {
            lblImage.setVisibility(View.VISIBLE);
        }
    }
}
