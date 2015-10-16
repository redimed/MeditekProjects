package com.redimed.telehealth.patient.fragment;


import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.ModelActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.ClinicalDetail;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedByteArray;

/**
 * A simple {@link Fragment} subclass.
 */
public class TelehealthFragment extends Fragment {

    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private String TAG = "TELEHEALTH";
    private View v;
    private SharedPreferences telehealthPatient;
    private RegisterApi registerApi;
    private Gson gson;
    private String headerToken, fromTime, toTime, status, firstDoctor, middleDoctor, lastDoctor, emailDoctor, workPhoneDoctor, appointmentUID;
    private JsonObject patientJson, appointmentJson;
    private Patient patient;
    private Appointment appointment;
    private Intent i;

    @Bind(R.id.lblFromTime)
    TextView lblFromTime;
    @Bind(R.id.lblToTime)
    TextView lblToTime;
    @Bind(R.id.lblStatus)
    TextView lblStatus;
    @Bind(R.id.lblDoctorName)
    TextView lblDoctorName;
    @Bind(R.id.lblDoctorEmail)
    TextView lblDoctorEmail;
    @Bind(R.id.lblDoctorWorkPhone)
    TextView lblDoctorWorkPhone;
    @Bind(R.id.btnUpload)
    Button btnUpload;

    public TelehealthFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        v = inflater.inflate(R.layout.fragment_telehealth, container, false);
        ButterKnife.bind(this, v);
        gson = new Gson();
        patient = new Patient();
        registerApi = RESTClient.getRegisterApi();
        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        headerToken = telehealthPatient.getString("token", null);
        patient.setUID(telehealthPatient.getString("patientUID", null));
        patient.setLimit("1");
        GetAppointmentPatient();
        btnUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogUploadImage();
            }
        });
        return v;
    }

    private void DialogUploadImage() {
        AlertDialog alertDialog = new AlertDialog.Builder(v.getContext()).create();
        alertDialog.setTitle("Choose an action");
        alertDialog.setMessage("Choose an action Camera or Photo Library");

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Photo", new DialogInterface.OnClickListener() {
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
                startActivityForResult(cameraIntent, RESULT_CAMERA);
            }
        });
        alertDialog.show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        String picturePath = null;
        int columnIndex;
        Cursor cursor;
        Bitmap image = null;
        try {
            if (resultCode == getActivity().RESULT_OK){
                switch (requestCode){
                    case RESULT_PHOTO:
                        //Get uri image
                        Uri selectedImage = data.getData();
                        String[] filePathColumn = {MediaStore.Images.Media.DATA};
                        //Get cursor
                        cursor = v.getContext().getContentResolver().query(selectedImage, filePathColumn, null, null, null);
                        cursor.moveToFirst();
                        //Get path form cursor index
                        columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                        picturePath = cursor.getString(columnIndex);
                        cursor.close();
                        break;

                    case RESULT_CAMERA:
                        //Get bitmap data image
                        image = (Bitmap) data.getExtras().get("data");
                        //Get uri image
                        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
                        image.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
                        String pathImageUri = MediaStore.Images.Media.insertImage(v.getContext().getContentResolver(), image, "Title", null);
                        //Get real path from uri image
                        cursor = v.getContext().getContentResolver().query(Uri.parse(pathImageUri), null, null, null, null);
                        cursor.moveToFirst();
                        columnIndex = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
                        picturePath = cursor.getString(columnIndex);
                        cursor.close();
                        break;
                }
                    i = new Intent(v.getContext(), ModelActivity.class);
                    i.putExtra("picturePath", picturePath);
                    i.putExtra("patientUID", telehealthPatient.getString("patientUID", null));
                    startActivity(i);
            }else {
                Toast.makeText(v.getContext(), "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        }catch (Exception ex){
            Toast.makeText(v.getContext(), "Something went wrong", Toast.LENGTH_LONG).show();
        }
    }

    //    Get single or list Appointment to Patient
    private void GetAppointmentPatient() {
        patientJson = new JsonObject();
        patientJson.addProperty("data", gson.toJson(patient));
        registerApi.getAppointmentPatients(patientJson, headerToken, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("rows").toString();
                Appointment[] appointments = gson.fromJson(data, Appointment[].class);
                DisplayAppointmentPatient(appointments);
            }

            @Override
            public void failure(RetrofitError error) {
                if (error != null){
                    String json = new String(((TypedByteArray) error.getResponse().getBody()).getBytes());
                    try {
                        JSONObject dataObject = new JSONObject(json);
                        String message = (String.valueOf(((MyApplication) v.getContext().getApplicationContext()).isJSONValid(dataObject.optString("ErrorsList"))) == null ) ? error.getMessage() : dataObject.optString("ErrorsList");
                        Log.d(TAG, message);
                        new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Error, message).show();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    //    Display Appointment on the layout
    private void DisplayAppointmentPatient(Appointment[] appointments) {
        Doctor[] doctors;

        for (int i = 0; i < appointments.length; i++) {
            fromTime = appointments[i].getFromTime() == null ? "NONE" : appointments[i].getFromTime();
            toTime = appointments[i].getToTime() == null ? "NONE" : appointments[i].getToTime();
            status = appointments[i].getStatus() == null ? "NONE" : appointments[i].getStatus();
            doctors = appointments[i].getDoctor();
            for (int j = 0; j < doctors.length; j++) {
                firstDoctor = doctors[i].getFirstName() == null ? " " : doctors[i].getFirstName();
                middleDoctor = doctors[i].getMiddleName() == null ? " " : doctors[i].getMiddleName();
                lastDoctor = doctors[i].getLastName() == null ? " " : doctors[i].getLastName();
                emailDoctor = doctors[i].getEmail();
                workPhoneDoctor = doctors[i].getWorkPhoneNumber() == null ? "NONE" : doctors[i].getWorkPhoneNumber();
            }
            appointmentUID = appointments[i].getUID() == null ? "N/A" : appointments[i].getUID();
        }

        lblFromTime.setText(ConvertDateTime(fromTime));
        lblToTime.setText(ConvertDateTime(toTime));
        if (status.equalsIgnoreCase("Approved"))
        {
            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.approved));
        }else {
            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.unapproved));
        }
        lblStatus.setText(status);
        lblDoctorName.setText(firstDoctor + middleDoctor + lastDoctor);
        lblDoctorEmail.setText(emailDoctor);
        lblDoctorWorkPhone.setText(workPhoneDoctor);
    }

    @NonNull
    private String ConvertDateTime(String dataTime) {
        Log.d(TAG, dataTime);
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        Date myDate = null;
        try {
            myDate = dateFormat.parse(dataTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SimpleDateFormat timeFormat = new SimpleDateFormat("dd/MM/yyyy-HH:mm:ss");
        String finalDate = timeFormat.format(myDate);

        return finalDate;
    }

    //    Get Detail Appointment with param UID Appointment
    private void GetAppointmentDetails(String appointmentUID) {
        appointment = new Appointment();
        appointment.setUID(appointmentUID);
        appointmentJson = new JsonObject();
        appointmentJson.addProperty("data", gson.toJson(appointment));
        registerApi.getAppointmentDetails(appointmentJson, headerToken, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("data").toString();
                String clinicData = jsonObject.get("data").getAsJsonObject().get("TelehealthAppointment").getAsJsonObject().get("ClinicalDetails").toString();
                ClinicalDetail[] clinicalDetails = gson.fromJson(clinicData, ClinicalDetail[].class);
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getMessage());
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }
}
