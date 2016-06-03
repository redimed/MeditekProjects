package com.redimed.telehealth.patient.appointment;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Color;
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
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
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
    private Bundle bundle;
    private Context context;
    private boolean flagLayout = false;
    private SweetAlertDialog progressDialog;
    private IAppointmentPresenter iAppointmentPresenter;
    private static final String TAG = "=====DETAILS=====";

    /* Choose an action image */
    private Uri fileUri; //file to store image
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int RESULT_RELOAD = 3;
    private static final int MEDIA_TYPE_IMAGE = 1;

    private String firstDoctor;
    private String middleDoctor;
    private String lastDoctor;

    /* Filed Appointment */
    @Bind(R.id.lblDate)
    TextView lblDate;
    @Bind(R.id.lblTime)
    TextView lblTime;
    @Bind(R.id.lblStatus)
    TextView lblStatus;
    @Bind(R.id.lblDoctorName)
    TextView lblDoctorName;
    @Bind(R.id.layoutStatus)
    RelativeLayout layoutStatus;
    @Bind(R.id.lblCode)
    TextView lblCode;
    @Bind(R.id.btnUpload)
    TextView btnUpload;
    @Bind(R.id.rvImageAppointment)
    RecyclerView rvImageAppointment;
    @Bind(R.id.lblImage)
    TextView lblImage;
    @Bind(R.id.lblApptType)
    TextView lblApptType;

    /* Field Information Patient */
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
    @Bind(R.id.lblDOB)
    TextView lblDOB;
    @Bind(R.id.lblEmail)
    TextView lblEmail;
    @Bind(R.id.lblDes)
    TextView lblDes;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;

    public AppointmentFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_appointment_details, container, false);
        setHasOptionsMenu(true);
        this.context = v.getContext();
        ButterKnife.bind(this, v);

        initVariable();

        btnUpload.setOnClickListener(this);
        layoutStatus.setOnClickListener(this);

        return v;
    }

    private void initVariable() {
        gson = new Gson();
        iAppointmentPresenter = new AppointmentPresenter(context, this, getActivity());
        iAppointmentPresenter.initToolbar(toolBar);

        bundle = getArguments();
        if (bundle != null) {
            iAppointmentPresenter.getAppointmentDetails(bundle.getString("apptUID", ""));
        }
        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);
        progressDialog.show();
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
                iAppointmentPresenter.changeFragment(new TrackingFragment());
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onLoadAppointment(JsonObject dataAppt) {
        if (!dataAppt.get("data").isJsonNull()) {
            String fromTime = dataAppt.get("data").getAsJsonObject().get("FromTime").isJsonNull() ?
                    "NONE" : dataAppt.get("data").getAsJsonObject().get("FromTime").getAsString();


            String status = dataAppt.get("data").getAsJsonObject().get("Status").isJsonNull() ?
                    "NONE" : dataAppt.get("data").getAsJsonObject().get("Status").getAsString();

            String code = dataAppt.get("data").getAsJsonObject().get("Code").isJsonNull() ?
                    "NONE" : dataAppt.get("data").getAsJsonObject().get("Code").getAsString();

            String type = dataAppt.get("data").getAsJsonObject().get("Type").isJsonNull() ?
                    "NONE" : dataAppt.get("data").getAsJsonObject().get("Type").getAsString();

            GetInfoPatient(dataAppt);

            lblCode.setText(code);
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
        progressDialog.dismiss();
    }

    private void GetInfoPatient(JsonObject dataAppt) {
        String patientAppt = dataAppt.get("data").getAsJsonObject().get("TelehealthAppointment").getAsJsonObject().get("PatientAppointment").toString();
        PatientAppointment patientAppointment = gson.fromJson(patientAppt, PatientAppointment.class);
        lblFirstName.setText(patientAppointment.getFirstName() == null ? "NONE" : patientAppointment.getFirstName());
        lblLastName.setText(patientAppointment.getLastName() == null ? "NONE" : patientAppointment.getLastName());
        lblMobile.setText(patientAppointment.getPhoneNumber() == null ? "NONE" : patientAppointment.getPhoneNumber());
        lblHome.setText(patientAppointment.getHomePhoneNumber() == null ? "NONE" : patientAppointment.getHomePhoneNumber());
        lblSuburb.setText(patientAppointment.getSuburb() == null ? "NONE" : patientAppointment.getSuburb());
        lblDOB.setText(patientAppointment.getDOB() == null ? "NONE" : patientAppointment.getDOB());
        lblEmail.setText(patientAppointment.getEmail() == null ? "NONE" : patientAppointment.getEmail());
    }

    private String GetNameDoctor(JsonObject dataAppt) {
        Doctor[] doctors = gson.fromJson(dataAppt.get("data").getAsJsonObject().get("Doctors").toString(), Doctor[].class);
        if (doctors != null && doctors.length > 0) {
            for (Doctor doctor : doctors) {
                firstDoctor = doctor.getFirstName() == null ? "NONE" : doctor.getFirstName();
                middleDoctor = doctor.getMiddleName() == null ? " " : doctor.getMiddleName();
                lastDoctor = doctor.getLastName() == null ? " " : doctor.getLastName();
            }
            return firstDoctor + middleDoctor + lastDoctor;
        } else {
            return "NONE";
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.layoutStatus:
                iAppointmentPresenter.viewStatus();
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
                    i.putExtra("appointmentUID", bundle.getString("apptUID", ""));
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
    public void onLoadListImage(List<String> listImage, SharedPreferences spTelehealth) {
        if (listImage != null) {
            if (spTelehealth != null) {
                AdapterImageAppointment adapterImageAppointment = new AdapterImageAppointment(context, listImage, spTelehealth);

                PreCachingLayoutManager layoutManagerCategories = new PreCachingLayoutManager(context);
                layoutManagerCategories.setOrientation(LinearLayoutManager.HORIZONTAL);
                layoutManagerCategories.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

                rvImageAppointment.setLayoutManager(layoutManagerCategories);
                rvImageAppointment.setAdapter(adapterImageAppointment);
            }
            if (listImage.size() <= 0)
                lblImage.setVisibility(View.VISIBLE);
        }
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
        progressDialog.dismiss();
    }

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
                        iAppointmentPresenter.changeFragment(new TrackingFragment());
                        return true;
                    }
                    return false;
                }
            });
        }
    }
}
