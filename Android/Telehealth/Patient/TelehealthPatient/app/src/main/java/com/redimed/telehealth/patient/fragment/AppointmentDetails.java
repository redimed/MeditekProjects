package com.redimed.telehealth.patient.fragment;

import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.ModelActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.Config;
import com.redimed.telehealth.patient.utils.RVAdapterImage;

import java.io.ByteArrayOutputStream;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class AppointmentDetails extends Fragment {

    private String TAG = "TELEHEALTH";
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private View v;
    private SharedPreferences telehealthPatient;
    private RegisterApi registerApi;
    private Gson gson;
    private String fromTime, toTime, status, firstDoctor, middleDoctor, lastDoctor, emailDoctor, workPhoneDoctor, appointmentUID, accountUID;
    private JsonObject appointmentJson;
    private Patient patient;
    private Appointment appointment;
    private List<String> urlPicasso;
    private LinearLayoutManager layoutManagerCategories;
    private RVAdapterImage rvAdapterImage;
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
    @Bind(R.id.rvImageAppointment)
    RecyclerView rvImageAppointment;

    public AppointmentDetails() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        v = inflater.inflate(R.layout.fragment_appointment_details, container, false);
        ButterKnife.bind(this, v);

        telehealthPatient = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        accountUID = telehealthPatient.getString("userUID", null);
        urlPicasso = new ArrayList<String>();
        gson = new Gson();
        patient = new Patient();
        registerApi = RESTClient.getRegisterApi();

        appointmentUID = getArguments().getString("apptUID", null);
        Log.d(TAG + "=============", appointmentUID);
        GetAppointmentDetails(appointmentUID);

        rvImageAppointment.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(v.getContext());
        rvImageAppointment.setLayoutManager(layoutManagerCategories);
        rvAdapterImage = new RVAdapterImage();
        rvImageAppointment.setAdapter(rvAdapterImage);
        rvAdapterImage.swapData(urlPicasso);

        btnUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DialogUploadImage();
            }
        });
        return v;
    }

    //    Get Detail Appointment with param UID Appointment
    private void GetAppointmentDetails(String appointmentUID) {
        appointment = new Appointment();
        appointment.setUID(appointmentUID);
        appointmentJson = new JsonObject();
        appointmentJson.addProperty("data", gson.toJson(appointment));
        registerApi.getAppointmentDetails(appointmentJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                if (jsonObject.get("data").getAsJsonObject() != null) {
                    String doctor = jsonObject.get("data").getAsJsonObject().get("Doctors").toString();
                    Doctor[] doctors = gson.fromJson(doctor, Doctor[].class);

                    fromTime = jsonObject.get("data").getAsJsonObject().get("FromTime").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString();
                    toTime = jsonObject.get("data").getAsJsonObject().get("ToTime").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("ToTime").getAsString();
                    status = jsonObject.get("data").getAsJsonObject().get("Status").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("Status").getAsString();

                    if (doctors.length > 0) {
                        for (int i = 0; i < doctors.length; i++) {
                            firstDoctor = doctors[i].getFirstName() == null ? " " : doctors[i].getFirstName();
                            middleDoctor = doctors[i].getMiddleName() == null ? " " : doctors[i].getMiddleName();
                            lastDoctor = doctors[i].getLastName() == null ? " " : doctors[i].getLastName();
                            emailDoctor = doctors[i].getEmail() == null ? " " : doctors[i].getEmail();
                            workPhoneDoctor = doctors[i].getWorkPhoneNumber() == null ? "NONE" : doctors[i].getWorkPhoneNumber();
                        }
                    } else {
                        firstDoctor = " ";
                        middleDoctor = " ";
                        lastDoctor = " ";
                        emailDoctor = " ";
                        workPhoneDoctor = " ";
                    }

                    if (fromTime.equalsIgnoreCase("NONE") || toTime.equalsIgnoreCase("NONE")) {
                        AlertDialog alertDialog = new AlertDialog.Builder(v.getContext()).create();
                        alertDialog.setTitle(R.string.title_dialog_appt);
                        alertDialog.setMessage(v.getContext().getResources().getString(R.string.message_dialog_appt));

                        alertDialog.setButton(DialogInterface.BUTTON_POSITIVE, "Close", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                ((MainActivity) v.getContext()).Display(2);
                            }
                        });
                        alertDialog.show();
                    } else {
                        lblFromTime.setText(MyApplication.getInstance().ConvertDateTime(fromTime));
                        lblToTime.setText(MyApplication.getInstance().ConvertDateTime(fromTime));
                        if (status.equalsIgnoreCase("Approved")) {
                            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.approved));
                        } else {
                            lblStatus.setTextColor(ContextCompat.getColor(v.getContext(), R.color.unapproved));
                        }
                        lblStatus.setText(status);
                        lblDoctorName.setText(firstDoctor + middleDoctor + lastDoctor);
                        lblDoctorEmail.setText(emailDoctor);
                        lblDoctorWorkPhone.setText(workPhoneDoctor);
                    }

                    String fileUpload = jsonObject.get("data").getAsJsonObject().get("FileUploads").toString();
                    FileUpload[] fileUploads = gson.fromJson(fileUpload, FileUpload[].class);
                    GetFileUpload(fileUploads);
                } else {
                    Log.d(TAG, "No Result");
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }

    private void GetFileUpload(FileUpload[] fileUploads) {
        for (int i = 0; i < fileUploads.length; i++){
            urlPicasso.add(Config.apiURLDownload + fileUploads[i].getUID());
        }
    }

    private void DialogUploadImage() {
        AlertDialog alertDialog = new AlertDialog.Builder(v.getContext()).create();
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
            if (resultCode == getActivity().RESULT_OK) {
                switch (requestCode) {
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
                i.putExtra("userUID", accountUID);
                i.putExtra("appointmentUID", appointmentUID);
                startActivity(i);
            } else {
                Toast.makeText(v.getContext(), "You haven't picked Image", Toast.LENGTH_LONG).show();
            }
        } catch (Exception ex) {
            Toast.makeText(v.getContext(), "Something went wrong", Toast.LENGTH_LONG).show();
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
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(2);
                    return true;
                }
                return false;
            }
        });
    }
}
