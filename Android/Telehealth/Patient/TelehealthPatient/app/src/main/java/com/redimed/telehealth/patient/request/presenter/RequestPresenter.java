package com.redimed.telehealth.patient.request.presenter;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.faq.FAQsFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.AppointmentData;
import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.request.RequestFragment;
import com.redimed.telehealth.patient.request.view.IRequestView;
import com.redimed.telehealth.patient.utlis.DefineKey;
import com.redimed.telehealth.patient.utlis.UploadFileRequest;
import com.redimed.telehealth.patient.views.SignaturePad;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import cn.pedant.SweetAlert.SweetAlertDialog;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.mime.TypedFile;

public class RequestPresenter implements IRequestPresenter {

    private Gson gson;
    private File file;
    private Context context;
    private RegisterApi registerApi;
    private IRequestView iRequestView;
    private SimpleDateFormat dateFormat;
    private IMainPresenter iMainPresenter;
    private SweetAlertDialog progressDialog;
    private SharedPreferences uidTelehealth;
    private String pathSign = "", signatureUID;
    private PatientAppointment patientAppointment;
    private String firstName, lastName, mobile, home, suburb, apptType, dob, email, des;
    private static final String TAG = "===REQUEST_PRESENTER===";

    public RequestPresenter(Context context, IRequestView iRequestView, FragmentActivity activity) {
        this.context = context;
        this.iRequestView = iRequestView;

        gson = new Gson();
        patientAppointment = new PatientAppointment();
        iMainPresenter = new MainPresenter(context, activity);
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);

        //init progressDialog
        progressDialog = new SweetAlertDialog(context, SweetAlertDialog.PROGRESS_TYPE);
        progressDialog.getProgressHelper().setBarColor(Color.parseColor("#B42047"));
        progressDialog.setTitleText("Loading");
        progressDialog.setCancelable(false);
    }

    @Override
    public ArrayAdapter loadJsonData() {
        ArrayAdapter adapter = null;
        try {
            file = new File("/data/data/" + context.getApplicationContext().getPackageName() + "/" + context.getResources().getString(R.string.fileSuburb));
            if (file.exists()) {
                FileInputStream is = new FileInputStream(file);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);
                String[] suburbs = gson.fromJson(obj.get("data"), String[].class);
                adapter = new ArrayAdapter(context, android.R.layout.simple_list_item_1, suburbs);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return adapter;
    }

    @Override
    public Patient[] loadDataInfoExists() {
        Patient[] patients = null;
        file = new File("/data/data/" + context.getApplicationContext().getPackageName() + "/shared_prefs/PatientInfo.xml");
        if (file.exists()) {
            SharedPreferences spPatientInfo = context.getSharedPreferences("PatientInfo", Context.MODE_PRIVATE);
            patients = gson.fromJson(spPatientInfo.getString("info", ""), Patient[].class);
        }
        return patients;
    }

    @Override
    public void displayDatePickerDialog() {
        Calendar birthdayCalendar = Calendar.getInstance();
        DatePickerDialog birthdayPickerDialog = new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                iRequestView.onLoadDOB(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    @Override
    public void hideKeyboardFragment(View view) {
        //Set up touch listener for non-text box views to hide keyboard.
        if (!(view instanceof EditText)) {
            view.setOnTouchListener(new View.OnTouchListener() {
                public boolean onTouch(View v, MotionEvent event) {
                    InputMethodManager inputMethodManager = (InputMethodManager)
                            context.getSystemService(Activity.INPUT_METHOD_SERVICE);
                    inputMethodManager.hideSoftInputFromWindow(((Activity) context).getCurrentFocus().getWindowToken(), 0);
                    return false;
                }
            });
        }

        //If a layout container, iterate over children and seed recursion.
        if (view instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                View innerView = ((ViewGroup) view).getChildAt(i);
                hideKeyboardFragment(innerView);
            }
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void getValueSign(String sign) {
        String url = Config.apiURLDownload + sign;
        GlideUrl glideUrl = new GlideUrl(url, new LazyHeaders.Builder()
                .addHeader("SystemType", DefineKey.SystemType)
                .addHeader("AppID", DefineKey.AppID)
                .addHeader("Cookie", uidTelehealth.getString("cookie", ""))
                .addHeader("DeviceID", uidTelehealth.getString("deviceID", ""))
                .addHeader("Authorization", "Bearer " + uidTelehealth.getString("token", ""))
                .build());

        int myWidth = 300;
        int myHeight = 300;
        Glide.with(context).load(glideUrl)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        iRequestView.onLoadImgSignature(resource, pathSign);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        iRequestView.onLoadImgSignature(null, pathSign);
                    }
                });
    }

    @Override
    public void checkFields(ArrayList<EditText> arrEditText, String suburb, String apptType) {
        if (isValidateForm(arrEditText) && !suburb.equalsIgnoreCase("") && !apptType.equalsIgnoreCase("")) {
            this.suburb = suburb;
            this.apptType = apptType;

            GetDataField(arrEditText);
        } else if (suburb.equalsIgnoreCase("")) {
            iRequestView.onResultSuburb(false);
        } else if (apptType.equalsIgnoreCase("")) {
            iRequestView.onResultApptType(false);
        }
    }

    private void GetDataField(ArrayList<EditText> arrayList) {
        for (EditText editText : arrayList) {
            switch (editText.getId()) {
                case R.id.txtFirstName:
                    firstName = editText.getText().toString();
                    break;
                case R.id.txtLastName:
                    lastName = editText.getText().toString();
                    break;
                case R.id.txtMobile:
                    mobile = editText.getText().toString();
                    break;
                case R.id.txtDOB:
                    dob = editText.getText().toString();
                    break;
                case R.id.txtEmail:
                    email = editText.getText().toString();
                    break;
                case R.id.txtHome:
                    home = editText.getText().toString();
                    break;
                case R.id.txtDescription:
                    des = editText.getText().toString();
                    break;
            }
        }
        patientAppointment.setFirstName(firstName);
        patientAppointment.setLastName(lastName);
        patientAppointment.setPhoneNumber(mobile);
        patientAppointment.setHomePhoneNumber(home);
        patientAppointment.setDOB(dob);
        patientAppointment.setSuburb(suburb);
        patientAppointment.setEmail(email);

        iRequestView.changeViewFlipper();
    }

    //Get list Appointment Type
    @Override
    public ArrayAdapter<String> setDataApptType() {
        final Boolean[] flag = { true };
        List<String> apptType = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.appt_type_arrays)));

        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(context, android.R.layout.simple_list_item_1, apptType) {
            @Override
            public boolean isEnabled(int position) {
                return position != 0;
            }

            @Override
            public View getDropDownView(int position, View convertView, ViewGroup parent) {
                View view = super.getDropDownView(position, convertView, parent);
                TextView textView = (TextView) view;
                if (position == 0) {
                    textView.setTextColor(Color.GRAY);
                } else {
                    textView.setTextColor(Color.BLACK);
                }
                return view;
            }

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                if (flag[0]) {
                    flag[0] = false;
                    View view = super.getView(position, convertView, parent);
                    ((TextView) view).setTextColor(Color.GRAY);
                    return view;
                }
                return super.getView(position, convertView, parent);
            }
        };
        spinnerArrayAdapter.setDropDownViewResource(android.R.layout.simple_list_item_1);
        return spinnerArrayAdapter;
    }

    @Override
    public void returnData(Bundle bundle) {
        if (bundle != null) {
            patientAppointment.setFirstName(bundle.getString("firstName"));
            patientAppointment.setLastName(bundle.getString("lastName"));
            patientAppointment.setPhoneNumber(bundle.getString("mobile"));
            patientAppointment.setHomePhoneNumber(bundle.getString("home"));
            patientAppointment.setDOB(bundle.getString("dob"));
            patientAppointment.setSuburb(bundle.getString("suburb"));
            patientAppointment.setEmail(bundle.getString("email"));
            signatureUID = bundle.getString("sign");
        } else {
            iMainPresenter.replaceFragment(new RequestFragment());
        }
    }

    @Override
    public void displayFAQs(ArrayList<CustomGallery> customGalleries) {
        Bundle bundle = new Bundle();
        bundle.putBoolean("confirmRequest", true);
        bundle.putString("firstName", firstName);
        bundle.putString("lastName", lastName);
        bundle.putString("mobile", mobile);
        bundle.putString("home", home);
        bundle.putString("suburb", suburb);
        bundle.putString("apptType", apptType);
        bundle.putString("dob", dob);
        bundle.putString("email", email);
        bundle.putString("des", des);
        bundle.putParcelableArrayList("fileUploads", customGalleries);
        bundle.putString("sign", signatureUID);

        Bundle backupConfirm = new Bundle();
        backupConfirm.putString("msg", "ConfirmFAQs");
        backupConfirm.putBundle("dataConfirm", bundle);

        Fragment fragment = new FAQsFragment();
        fragment.setArguments(backupConfirm);
        iMainPresenter.replaceFragment(fragment);
    }

    private boolean isValidateForm(ArrayList<EditText> arr) {
        boolean isValid = true;
        // Validation Edit Text
        for (int i = 0; i < arr.size(); i++) {
            if (isRequiredData(arr.get(i)) && arr.get(i).getId() != R.id.txtHome && arr.get(i).getId() != R.id.txtDescription) {
                iRequestView.onResultField(arr.get(i));
                isValid = false;
            }
            if (arr.get(i).getId() == R.id.txtMobile) {
                if (!isContactValid(arr.get(i))) {
                    iRequestView.onResultMobile(isContactValid(arr.get(i)));
                    isValid = false;
                }
            }
            if (arr.get(i).getId() == R.id.txtEmail) {
                if (!isEmailValid(arr.get(i))) {
                    iRequestView.onResultEmail(isEmailValid(arr.get(i)));
                    isValid = false;
                }
            }
        }
        return isValid;
    }

    public boolean isRequiredData(EditText editText) {
        boolean isRequire = false;
        if (editText.getText().length() == 0) {
            isRequire = true;
        }
        return isRequire;
    }

    //Load choose image
    @Override
    public void setImageGallery(String[] allPath) {
        ArrayList<CustomGallery> dataT = new ArrayList<CustomGallery>();
        for (String string : allPath) {
            CustomGallery item = new CustomGallery();
            item.sdcardPath = string;
            dataT.add(item);
        }
        iRequestView.onLoadGallery(dataT);
    }

    // Validate contact phone
    public boolean isContactValid(EditText editText) {
        boolean isValid = false;
        String editTextContactNo = editText.getText().toString();
        String expression = "^(\\+61|0061|0)?4[0-9]{8}$";
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(editTextContactNo);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    // Validate email
    public boolean isEmailValid(EditText editText) {
        boolean isValid = false;
        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        CharSequence inputStr = editText.getText();
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(inputStr);
        if (matcher.matches()) {
            isValid = true;
        }
        return isValid;
    }

    @Override
    public void saveBitmapSign(SignaturePad signaturePad) {
        Bitmap signatureBitmap = signaturePad.getSignatureBitmap();
        if (addSignatureToGallery(signatureBitmap)) {
            iRequestView.onLoadImgSignature(signatureBitmap, pathSign);
        }
    }

    public File getAlbumStorageDir(String albumName) {
        // Get the directory for the user's public pictures directory.
        File file = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES), albumName);
        if (!file.mkdirs()) {
            Log.d("SignaturePad", "Directory not created");
        }
        return file;
    }

    public void saveBitmapToJPG(Bitmap bitmap, File photo) throws IOException {
        Bitmap newBitmap = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(newBitmap);
        canvas.drawColor(Color.WHITE);
        canvas.drawBitmap(bitmap, 0, 0, null);

        OutputStream stream = new FileOutputStream(photo);
        newBitmap.compress(Bitmap.CompressFormat.JPEG, 80, stream);

        stream.close();
    }

    private boolean addSignatureToGallery(Bitmap signature) {
        boolean result = false;
        try {
            File photo = new File(getAlbumStorageDir("SignaturePad"), String.format("Signature_%d.jpg", System.currentTimeMillis()));
            pathSign = photo.getPath();
            saveBitmapToJPG(signature, photo);
            Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
            Uri contentUri = Uri.fromFile(photo);
            mediaScanIntent.setData(contentUri);
            context.sendBroadcast(mediaScanIntent);
            result = true;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public boolean isCheckPatientConsent(CheckBox checkBox1, CheckBox checkBox2, CheckBox checkBox3) {
        return checkBox1.isChecked() && checkBox2.isChecked() && checkBox3.isChecked();
    }

    @Override
    public void uploadNonLogin(String path) {
        registerApi = RESTClient.getRegisterApiCore();
        final TypedFile typedFile = new TypedFile("multipart/form-data", new File(path));

        registerApi.uploadFileNonLogin("2d0626f3-e741-11e5-8fab-0050569f3a15", "Signature", typedFile, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, retrofit.client.Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {
                    signatureUID = jsonObject.get("fileUID").getAsString();
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }

    @Override
    public String getCurrentDateSystem() {
        SimpleDateFormat inputFormat = new SimpleDateFormat("EEE, dd MMM yyyy 'at' HH:mm a", Locale.ENGLISH);
        return inputFormat.format(new Date());
    }

    private String GetCurrentDateSubmit() {
//        String currentDate = "NONE" ;
//        SimpleDateFormat inputFormat = new SimpleDateFormat("EEE, dd MMM yyyy 'at' HH:mm a", Locale.ENGLISH);
//        currentDate = inputFormat.format(new Date());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z", Locale.ENGLISH);
//        try {
//            Date date = inputFormat.parse(inputFormat.format(new Date()));
//            currentDate = simpleDateFormat.format(date);
//        } catch (ParseException e) {
//            Log.d(TAG, e.getLocalizedMessage());
//        }
        return simpleDateFormat.format(new Date());
    }

    private ArrayList<FileUpload> listImageRequest(ArrayList<CustomGallery> customGalleries) {
        progressDialog.show();
        ArrayList<FileUpload> fileUploads = new ArrayList<>();
        for (int i = 0; i < customGalleries.size(); i++) {
            try {
                FileUpload fileUpload = new UploadFileRequest(customGalleries.get(i).sdcardPath, context).execute().get();
                fileUploads.add(fileUpload);
            } catch (InterruptedException | ExecutionException e) {
                e.getLocalizedMessage();
            }
        }
        return fileUploads;
    }

    @Override
    public void completeRequest(ArrayList<CustomGallery> customGalleries) {
        JsonObject jConsent1 = new JsonObject();
        jConsent1.addProperty("Section", "Telehealth");
        jConsent1.addProperty("Category", "Appointment");
        jConsent1.addProperty("Type", "RequestPatient");
        jConsent1.addProperty("Name", "PatientConsent1");
        jConsent1.addProperty("Value", "Y");

        JsonObject jConsent2 = new JsonObject();
        jConsent2.addProperty("Section", "Telehealth");
        jConsent2.addProperty("Category", "Appointment");
        jConsent2.addProperty("Type", "RequestPatient");
        jConsent2.addProperty("Name", "PatientConsent2");
        jConsent2.addProperty("Value", "Y");

        JsonObject jConsent3 = new JsonObject();
        jConsent3.addProperty("Section", "Telehealth");
        jConsent3.addProperty("Category", "Appointment");
        jConsent3.addProperty("Type", "RequestPatient");
        jConsent3.addProperty("Name", "PatientConsent3");
        jConsent3.addProperty("Value", "Y");

        JsonObject jConsent4 = new JsonObject();
        jConsent4.addProperty("Section", "Telehealth");
        jConsent4.addProperty("Category", "Appointment");
        jConsent4.addProperty("Type", "RequestPatient");
        jConsent4.addProperty("Name", "Signature");
        jConsent4.addProperty("Value", signatureUID);

        ArrayList<AppointmentData> appointmentDataArrayList = new ArrayList<>();
        appointmentDataArrayList.add(gson.fromJson(jConsent1, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent2, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent3, AppointmentData.class));
        appointmentDataArrayList.add(gson.fromJson(jConsent4, AppointmentData.class));

        JsonObject jRequest = new JsonObject();
        jRequest.addProperty("RequestDate", GetCurrentDateSubmit());
        jRequest.addProperty("Description", des);
        jRequest.addProperty("Type", apptType);
        jRequest.addProperty("PatientAppointment", gson.toJson(patientAppointment));
        jRequest.addProperty("AppointmentData", gson.toJson(appointmentDataArrayList));
        jRequest.addProperty("FileUploads", gson.toJson(listImageRequest(customGalleries)));

        JsonObject dataRequest = new JsonObject();
        dataRequest.addProperty("data", jRequest.toString());

        registerApi = RESTClient.getRegisterApi();
        registerApi.requestTelehealth(dataRequest, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, retrofit.client.Response response) {
                progressDialog.dismiss();
                iRequestView.onLoadSuccess();
            }

            @Override
            public void failure(RetrofitError error) {
                progressDialog.dismiss();
                iRequestView.onLoadError(error.getLocalizedMessage());
            }
        });
    }
}

//class UploadFileRequest extends AsyncTask<String, String, FileUpload> {
//
//    private String pathImage;
//    private SharedPreferences uidTelehealth;
//    private static final String TAG = "=====UPLOAD=====";
//
//    public UploadFileRequest(String path, Context context) {
//        this.pathImage = path;
//        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
//    }
//
//    @Override
//    protected final FileUpload doInBackground(String... params) {
//        try {
//            File sourceFile = new File(pathImage);
//            MediaType MEDIA_TYPE = MediaType.parse("multipart/form-data");
//
//            RequestBody requestBody = new MultipartBuilder()
//                    .type(MultipartBuilder.FORM)
//                    .addFormDataPart("userUID", uidTelehealth.getString("userUID", ""))
//                    .addFormDataPart("fileType", "MedicalImage")
//                    .addFormDataPart("uploadFile", "ImageRequest", RequestBody.create(MEDIA_TYPE, sourceFile)).build();
//
//            Request request = new Request.Builder()
//                    .url(Config.apiURLCore + "/api/uploadFile")
//                    .post(requestBody)
//                    .build();
//
//            OkHttpClient okHttpClient = new OkHttpClient();
//            okHttpClient.interceptors().add(new RESTClient.RequestInterceptor());
//
//            Response response = okHttpClient.newCall(request).execute();
//
//            if (response.isSuccessful()) {
//                String strBody = response.body().string();
//                String strUID = new JsonParser().parse(strBody).getAsJsonObject().get("fileUID").getAsString();
//
//                FileUpload fileUpload = new FileUpload();
//                fileUpload.setUID(strUID);
//
//                return fileUpload;
//            } else
//                return null;
//        } catch (Exception e) {
//            Log.d(TAG, e.getLocalizedMessage());
//            return null;
//        }
//    }
//}
