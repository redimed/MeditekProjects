package com.redimed.telehealth.patient.request.presenter;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.DatePicker;
import android.widget.EditText;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.models.PatientAppointment;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.request.view.IRequestView;
import com.redimed.telehealth.patient.utlis.AdapterGallery;
import com.redimed.telehealth.patient.utlis.CountingTypedFile;
import com.redimed.telehealth.patient.utlis.UploadProgress;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedFile;

/**
 * Created by Fox on 1/22/2016.
 */
public class RequestPresenter implements IRequestPresenter {

    private Gson gson;
    private File file;
    private Context context;
    private long totalSize = 0;
    private IRequestView iRequestView;
    private SimpleDateFormat dateFormat;
    private IMainPresenter iMainPresenter;
    private SharedPreferences uidTelehealth;
    private RegisterApi registerApiCore, registerApi;
    private CountingTypedFile.ProgressListener listener;
    private String TAG = "REQUEST_PRESENTER", firstName, lastName, mobile, home, suburb, dob, email, des;

    public RequestPresenter(Context context, IRequestView iRequestView, FragmentActivity activity) {
        this.context = context;
        this.iRequestView = iRequestView;

        gson = new Gson();
        iRequestView.onLoadToolbar();
        registerApi = RESTClient.getRegisterApi();
        registerApiCore = RESTClient.getRegisterApiCore();
        iMainPresenter = new MainPresenter(context, activity);
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void loadJsonData() {
        try {
            file = new File("/data/data/" + context.getApplicationContext().getPackageName() + "/" +
                    context.getResources().getString(R.string.fileName));
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
                iRequestView.onLoadSuburb(suburbs);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void loadDataInfoExists() {
        file = new File("/data/data/" + context.getApplicationContext().getPackageName() + "/shared_prefs/PatientInfo.xml");
        if (file.exists()) {
            SharedPreferences spPatientInfo = context.getSharedPreferences("PatientInfo", Context.MODE_PRIVATE);
            Patient[] patients = gson.fromJson(spPatientInfo.getString("info", ""), Patient[].class);
            iRequestView.onLoadData(patients);
        }
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

    //Check
    @Override
    public EditText checkDataField(View v) {
        EditText invalid = null;
        if (v instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) v).getChildCount(); i++) {
                Object child = ((ViewGroup) v).getChildAt(i);
                if (child instanceof EditText) {
                    if (((EditText) child).getId() != R.id.txtHome && ((EditText) child).getId() != R.id.txtDescription) {
                        EditText e = (EditText) child;
                        if (e.getText().length() == 0) {    // Whatever logic here to determine if valid.
                            return e;   // Stops at first invalid one. But you could add this to a list.
                        } else {
                            switch (e.getId()) {
                                case R.id.txtMobile:
                                    iRequestView.onResultMobile(isContactValid(e));
                                    break;
                                case R.id.txtEmail:
                                    iRequestView.onResultEmail(isEmailValid(e));
                                    break;
                            }
                        }
                    }
                } else if (child instanceof ViewGroup) {
                    invalid = checkDataField((ViewGroup) child);  // Recursive call.
                    if (invalid != null) {
                        break;
                    }
                }
            }
        }
        iRequestView.onResultField(invalid);
        return invalid;
    }

    @Override
    public void uploadImage(ArrayList<CustomGallery> customGalleries, ArrayList<EditText> arrEditText, String suburb) {
        final List<FileUpload> fileUploads = new ArrayList<FileUpload>();
        if (isValidateForm(arrEditText) && !suburb.equalsIgnoreCase("")) {
            if (customGalleries.size() > 0) {
                TypedFile typedFile;
                final FileUpload fileUpload = new FileUpload();
                for (int i = 0; i < customGalleries.size(); i++) {
                    typedFile = new TypedFile("multipart/form-data", new File(customGalleries.get(i).sdcardPath));
                    registerApiCore.uploadFile(uidTelehealth.getString("userUID", ""), "MedicalImage", "", "", typedFile, new Callback<JsonObject>() {
                        @Override
                        public void success(JsonObject jsonObject, Response response) {
                            String status = jsonObject.get("status").getAsString();
                            if (status.equalsIgnoreCase("success")) {
                                fileUpload.setFileUID(jsonObject.get("fileUID").getAsString());
                                fileUploads.add(fileUpload);
                            }
                        }

                        @Override
                        public void failure(RetrofitError error) {
                            iRequestView.onErrorUpload(error.getLocalizedMessage());
                        }
                    });
                }
            }
            getDataField(arrEditText, suburb, fileUploads);
        } else if (suburb.equalsIgnoreCase("")) {
            iRequestView.onResultSuburb(false);
        }
    }

    private void getDataField(ArrayList<EditText> arrEditText, String suburb, List<FileUpload> fileUploads) {
        this.suburb = suburb;
        PatientAppointment patientAppointment = null;
        for (EditText editText : arrEditText) {
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
            patientAppointment = new PatientAppointment();
            patientAppointment.setFirstName(firstName);
            patientAppointment.setLastName(lastName);
            patientAppointment.setPhoneNumber(mobile);
            patientAppointment.setHomePhoneNumber(home);
            patientAppointment.setDOB(dob);
            patientAppointment.setSuburd(suburb);
            patientAppointment.setEmail(email);
        }
        makeRequest(patientAppointment, des, fileUploads);
    }

    private void makeRequest(PatientAppointment patientAppointment, String des, List<FileUpload> fileUploads) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String currentDate = sdf.format(new Date());

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("RequestDate", currentDate);
        jsonObject.addProperty("Description", des);
        jsonObject.addProperty("PatientAppointment", gson.toJson(patientAppointment));
        jsonObject.addProperty("FileUploads", gson.toJson(fileUploads));

        JsonObject dataRequest = new JsonObject();
        dataRequest.addProperty("data", gson.toJson(jsonObject));

        Log.d(TAG, dataRequest + "");
        registerApi.requestTelehealth(dataRequest, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                iRequestView.onResultRequest("success");
            }

            @Override
            public void failure(RetrofitError error) {
                iRequestView.onResultRequest(error.getLocalizedMessage());
            }
        });
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
        String expression = "^(\61|0061|0)?4[0-9]{8}$";
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
}
