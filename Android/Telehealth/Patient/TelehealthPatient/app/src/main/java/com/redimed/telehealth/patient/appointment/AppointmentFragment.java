package com.redimed.telehealth.patient.appointment;

import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AlertDialog;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.appointment.presenter.AppointmentPresenter;
import com.redimed.telehealth.patient.appointment.presenter.IAppointmentPresenter;
import com.redimed.telehealth.patient.appointment.view.IAppointmentView;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.tracking.TrackingFragment;
import com.redimed.telehealth.patient.widget.DialogConnection;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class AppointmentFragment extends Fragment implements IAppointmentView {

    private Gson gson;
    private Bundle bundle;
    private Context context;
    private SweetAlertDialog progressDialog;
    private IAppointmentPresenter iAppointmentPresenter;
    private static final String TAG = "=====DETAILS=====";

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

    public AppointmentFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_appointment_details, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);
        this.context = v.getContext();

        initVariable();
        layoutStatus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iAppointmentPresenter.viewStatus();
            }
        });

        return v;
    }

    private void initVariable() {
        gson = new Gson();
        iAppointmentPresenter = new AppointmentPresenter(context, this, getActivity());

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
