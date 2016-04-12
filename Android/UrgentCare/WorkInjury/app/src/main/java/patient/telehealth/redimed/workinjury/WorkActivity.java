package patient.telehealth.redimed.workinjury;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import patient.telehealth.redimed.workinjury.api.UrgentRequest;
import patient.telehealth.redimed.workinjury.model.UrgentRequestModel;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.TypefaceUtil;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class WorkActivity extends AppCompatActivity implements View.OnClickListener {

    private String TAG = "WORK";
    private DatePickerDialog birthdayPickerDialog;
    private SimpleDateFormat dateFormat;
    private UrgentRequest urgentRequestApi;
    private UrgentRequestModel objectUrgentRequest;
    private Gson gson;
    private String[] suburb;
    private List<EditText> arrEditText;
    private List<TextView> arrTextView;
    private Intent i;
    private String urgentType;
    private File f;
    private SweetAlertDialog dialog;

    @Bind(R.id.txtFirstName) EditText txtFirstName;
    @Bind(R.id.txtLastName) EditText txtLastName;
    @Bind(R.id.txtContactPhone) EditText txtContactPhone;
    @Bind(R.id.txtDOB) EditText txtDOB;
    @Bind(R.id.txtEmail) EditText txtEmail;
    @Bind(R.id.txtDescription) EditText txtDescription;
    @Bind(R.id.autoCompleteSuburb) AutoCompleteTextView autoCompleteSuburb;
    @Bind(R.id.btnWorkInjury) Button btnWorkInjury;
    @Bind(R.id.btnBack) Button btnBack;
    @Bind(R.id.txtTitle) TextView txtTitle;
    @Bind(R.id.lblFNRequire) TextView lblFNRequire;
    @Bind(R.id.lblLNRequire) TextView lblLNRequire;
    @Bind(R.id.lblPhoneRequire) TextView lblPhoneRequire;
    @Bind(R.id.lblCTRequire) TextView lblCTRequire;
    @Bind(R.id.lblCNRequire) TextView lblCNRequire;
    @Bind(R.id.txtCompanyName) EditText txtCompanyName;
    @Bind(R.id.txtContactPerson) EditText txtContactPerson;
    @Bind(R.id.txtCompanyPhone) EditText txtCompanyPhone;
    @Bind(R.id.radioGroupGPReferral) RadioGroup radioGroupGPReferral;
    @Bind(R.id.relativeLayoutGPReferral) RelativeLayout relativeLayoutGPReferral;
    @Bind(R.id.radioY) RadioButton radioY;
    @Bind(R.id.relativeLayoutTreatment) RelativeLayout relativeLayoutTreatment;
    @Bind(R.id.radioGroupTypeTreatment) RadioGroup radioGroupTypeTreatment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_work);

        TypefaceUtil.applyFont(this, findViewById(R.id.workActivity), "fonts/Roboto-Regular.ttf");
        ButterKnife.bind(this);
        urgentRequestApi = RESTClient.getRegisterApi();
        f = new File("/data/data/" + getApplicationContext().getPackageName() + "/shared_prefs/InformationUrgent.xml");
        gson = new Gson();
        dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        if (android.os.Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) {
            btnWorkInjury.getBackground().setColorFilter(ContextCompat.getColor(this, R.color.colorAccent), PorterDuff.Mode.MULTIPLY);
        } else {
            btnWorkInjury.setBackgroundResource(R.color.colorAccent);
        }
        txtDOB.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    DisplayDatePickerDialog();
                }
            }
        });
        radioY.setChecked(true);
        btnWorkInjury.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        LoadJsonData();
        GetDataURType();
        LoadDataInformation();
    }

    public void LoadDataInformation() {
        if (f.exists()) {
            SharedPreferences preferences = getSharedPreferences("InformationUrgent", MODE_PRIVATE);
            txtFirstName.setText(preferences.getString("FirstName", ""));
            txtLastName.setText(preferences.getString("LastName", ""));
            txtContactPhone.setText(preferences.getString("ContactPhone", ""));
            autoCompleteSuburb.setText(preferences.getString("Suburb", ""));
            txtDOB.setText(preferences.getString("DOB", ""));
            txtEmail.setText(preferences.getString("Email", ""));
        }
    }

    private void GetDataURType() {
        i = getIntent();
        if (i != null) {
            switch (i.getStringExtra("URType")) {
                case "tre":
                    relativeLayoutTreatment.setVisibility(View.VISIBLE);
                    txtTitle.setText(getResources().getText(R.string.green_btn));
                    urgentType = "tre";
                    break;
                case "spec":
                    txtTitle.setText(getResources().getText(R.string.blue_btn));
                    urgentType = "spec";
                    break;
                case "gp":
                    relativeLayoutGPReferral.setVisibility(View.GONE);
                    txtTitle.setText(getResources().getText(R.string.red_btn));
                    urgentType = "gp";
                    break;
            }
        }
    }

    public void LoadJsonData() {
        try {
            File f = new File(
                    "/data/data/" + getApplicationContext().getPackageName() + "/" +
                            getResources().getString(R.string.fileName)
            );
            if (f.exists()) {
                FileInputStream is = new FileInputStream(f);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);
                suburb = gson.fromJson(obj.get("data"), String[].class);
                ArrayAdapter adapter = new ArrayAdapter(this, android.R.layout.simple_list_item_1, suburb);
                autoCompleteSuburb.setThreshold(1);
                autoCompleteSuburb.setAdapter(adapter);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void DisplayDatePickerDialog() {
        Calendar birthdayCalendar = Calendar.getInstance();
        birthdayPickerDialog = new DatePickerDialog(this, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                txtDOB.setText(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    //Hide keyboard when touch out Edit Text
    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        View v = getCurrentFocus();
        if (v != null &&
                (ev.getAction() == MotionEvent.ACTION_UP || ev.getAction() == MotionEvent.ACTION_MOVE) &&
                v instanceof EditText &&
                !v.getClass().getName().startsWith("android.webkit.")) {
            int scrcoords[] = new int[2];
            v.getLocationOnScreen(scrcoords);
            float x = ev.getRawX() + v.getLeft() - scrcoords[0];
            float y = ev.getRawY() + v.getTop() - scrcoords[1];

            if (x < v.getLeft() || x > v.getRight() || y < v.getTop() || y > v.getBottom())
                hideKeyboard(this);
        }
        return super.dispatchTouchEvent(ev);
    }

    public static void hideKeyboard(AppCompatActivity activity) {
        if (activity != null && activity.getWindow() != null && activity.getWindow().getDecorView() != null) {
            InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(activity.getWindow().getDecorView().getWindowToken(), 0);
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnWorkInjury:
                arrEditText = new ArrayList<EditText>();
                arrEditText.add(txtFirstName);
                arrEditText.add(txtLastName);
                arrEditText.add(txtContactPhone);
                arrEditText.add(txtCompanyName);
                arrEditText.add(txtContactPerson);
                MakeAppointment(arrEditText);
                break;
            case R.id.btnBack:
                onBackPressed();
                break;
        }
    }

    private void MakeAppointment(List<EditText> arr) {
        if (!CheckValidateFrom(arr)) {
            dialog = new SweetAlertDialog(WorkActivity.this, SweetAlertDialog.ERROR_TYPE);
            dialog.setTitleText(getResources().getString(R.string.dialogError));
            dialog.setContentText(getResources().getString(R.string.contentDialogErrorFrom));
            dialog.setCancelable(false);
            dialog.show();
            return;
        }
        objectUrgentRequest = new UrgentRequestModel();
        objectUrgentRequest.setFirstName(txtFirstName.getText().toString());
        objectUrgentRequest.setLastName(txtLastName.getText().toString());
        objectUrgentRequest.setContactPhone(CheckContactNo(txtContactPhone.getText().toString()));
        objectUrgentRequest.setSuburb(autoCompleteSuburb.getText().toString());
        objectUrgentRequest.setDOB(txtDOB.getText().toString());
        objectUrgentRequest.setEmail(txtEmail.getText().toString());
        objectUrgentRequest.setDescription(txtDescription.getText().toString());
        objectUrgentRequest.setCompanyName(txtCompanyName.getText().toString());
        objectUrgentRequest.setContactPerson(txtContactPerson.getText().toString());
        objectUrgentRequest.setCompanyPhone(txtCompanyPhone.getText().toString());
        objectUrgentRequest.setUrgentRequestType("WorkInjury");
        objectUrgentRequest.setRequestDate(new SimpleDateFormat("yyyy/MM/dd HH:mm:ss Z").format(new Date()));
        objectUrgentRequest.setRehab(urgentType == "tre" ? "Y" : "N");
        objectUrgentRequest.setSpecialList(urgentType == "spec" ? "Y" : "N");
        objectUrgentRequest.setGeneralClinic(urgentType == "gp" ? "Y" : "N");
        if (!urgentType.equalsIgnoreCase("gp")) {
            objectUrgentRequest.setGPReferral((radioGroupGPReferral.getCheckedRadioButtonId() == -1) ? null : ((RadioButton) findViewById(radioGroupGPReferral.getCheckedRadioButtonId())).getHint().toString());
        }
        if (urgentType.equalsIgnoreCase("tre")) {
            String typeTreatment = (radioGroupTypeTreatment.getCheckedRadioButtonId() == -1) ? null : ((RadioButton) findViewById(radioGroupTypeTreatment.getCheckedRadioButtonId())).getHint().toString();
            if (typeTreatment != null) {
                switch (typeTreatment) {
                    case "0":
                        objectUrgentRequest.setPhysioTherapy("Y");
                        break;
                    case "1":
                        objectUrgentRequest.setExerciseRehab("Y");
                        break;
                    case "2":
                        objectUrgentRequest.setHandTherapy("Y");
                        break;
                }
            }
        }
        JsonObject urgentJson = new JsonObject();
        urgentJson.addProperty("data", gson.toJson(objectUrgentRequest));
        dialog = new SweetAlertDialog(this, SweetAlertDialog.PROGRESS_TYPE);
        dialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
        dialog.setTitleText(getResources().getString(R.string.progressMakeAppointmentContent));
        dialog.setCancelable(false);
        dialog.show();

        urgentRequestApi.sendUrgentRequest(urgentJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String data = jsonObject.get("data").getAsString();
                dialog.dismissWithAnimation();
                if (data.equalsIgnoreCase("success")) {
                    SharedPreferences infoUrgent = getSharedPreferences("InformationUrgent", MODE_PRIVATE);
                    dialog = new SweetAlertDialog(WorkActivity.this, SweetAlertDialog.SUCCESS_TYPE);
                    dialog.setTitleText(getResources().getString(R.string.dialogSuccess));
                    dialog.setContentText(getResources().getString(R.string.contentDialogSuccessAppointment));
                    dialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                        @Override
                        public void onClick(SweetAlertDialog sDialog) {
                            dialog.dismissWithAnimation();
                            onBackPressed();
                        }
                    });
                    if (f.exists()) {
                        CheckExistsInformation(dialog, infoUrgent);
                    } else {
                        InformationUrgent(dialog, infoUrgent);
                    }
                    dialog.show();
                }
            }

            @Override
            public void failure(RetrofitError error) {
                dialog.dismissWithAnimation();
                dialog = new SweetAlertDialog(WorkActivity.this, SweetAlertDialog.ERROR_TYPE);
                dialog.setTitleText(getResources().getString(R.string.dialogError));
                dialog.setContentText(error.getLocalizedMessage());
                dialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                    @Override
                    public void onClick(SweetAlertDialog sDialog) {
                        dialog.dismissWithAnimation();
                    }
                });
                dialog.show();
            }
        });
    }

    private void InformationUrgent(final SweetAlertDialog dialog, final SharedPreferences sharedPreferences) {
        dialog.setContentText(getResources().getString(R.string.confirmSaveInfo));
        dialog.setCancelText("Cancel");
        dialog.setCancelClickListener(new SweetAlertDialog.OnSweetClickListener() {
            @Override
            public void onClick(SweetAlertDialog sweetAlertDialog) {
                onBackPressed();
            }
        });
        dialog.setConfirmText("Save");
        dialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
            @Override
            public void onClick(SweetAlertDialog sweetAlertDialog) {
                SharedPreferences.Editor infoUrgent = sharedPreferences.edit();
                infoUrgent.putString("FirstName", txtFirstName.getText().toString());
                infoUrgent.putString("LastName", txtLastName.getText().toString());
                infoUrgent.putString("ContactPhone", txtContactPhone.getText().toString());
                infoUrgent.putString("Suburb", autoCompleteSuburb.getText().toString());
                infoUrgent.putString("DOB", txtDOB.getText().toString());
                infoUrgent.putString("Email", txtEmail.getText().toString());
                infoUrgent.commit();
                dialog.dismissWithAnimation();
                onBackPressed();
            }
        });
        dialog.show();
    }

    public void CheckExistsInformation(final SweetAlertDialog dialog, SharedPreferences s) {
        if (!txtFirstName.getText().toString().trim().equalsIgnoreCase(s.getString("FirstName", "").trim())
                || !txtLastName.getText().toString().trim().equalsIgnoreCase(s.getString("LastName", "").trim())
                || !txtContactPhone.getText().toString().trim().equalsIgnoreCase(s.getString("ContactPhone", "").trim())
                || !autoCompleteSuburb.getText().toString().trim().equalsIgnoreCase(s.getString("Suburb", "").trim())
                || !txtDOB.getText().toString().trim().equalsIgnoreCase(s.getString("DOB", "").trim())
                || !txtEmail.getText().toString().trim().equalsIgnoreCase(s.getString("Email", "").trim())) {
            InformationUrgent(dialog, s);
        }
    }

    private boolean CheckValidateFrom(List<EditText> arr) {
        arrTextView = new ArrayList<TextView>();
        arrTextView.add(lblFNRequire);
        arrTextView.add(lblLNRequire);
        arrTextView.add(lblPhoneRequire);
        arrTextView.add(lblCNRequire);
        arrTextView.add(lblCTRequire);

        // Initialize buttons
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.error_edit_text_icon);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());
        boolean validate = true;

        // Validation Edit Text
        for (int i = 0; i < arr.size(); i++) {
            if (CheckRequiredData(arr.get(i))) {
                arr.get(i).setError(getResources().getString(R.string.isRequired), customErrorDrawable);
                arrTextView.get(i).setVisibility(View.GONE);
                validate = false;
            } else {
                arr.get(i).setError(null);
            }
        }

        // Validate phone number australian phone number: 10digits (0X YYYY YYYY)
        if (CheckContactNo(txtContactPhone.getText().toString()) == "null") {
            txtContactPhone.setError(getResources().getString(R.string.contactPhoneRequired), customErrorDrawable);
            lblPhoneRequire.setVisibility(View.GONE);
            validate = false;
        } else if (CheckContactNo(txtContactPhone.getText().toString()) == "error") {
            txtContactPhone.setError(getResources().getString(R.string.contactPhoneFormat), customErrorDrawable);
            lblPhoneRequire.setVisibility(View.GONE);
            validate = false;
        } else {
            txtContactPhone.setError(null);
            lblPhoneRequire.setVisibility(View.VISIBLE);
        }

        // Validate email format
        if (!IsEmailValid(txtEmail) && txtEmail.getText().length() > 0) {
            txtEmail.setError(getResources().getString(R.string.emailValid), customErrorDrawable);
            validate = false;
        } else {
            txtEmail.setError(null);
        }

        if (CheckCompanyPhone(txtCompanyPhone) && txtCompanyPhone.getText().length() > 0) {
            txtCompanyPhone.setError(getResources().getString(R.string.companyPhoneFormat), customErrorDrawable);
            validate = false;
        } else {
            txtCompanyPhone.setError(null);
        }
        return validate;
    }

    public boolean CheckRequiredData(EditText editText) {
        boolean isRequire = false;
        if (editText.getText().length() == 0) {
            isRequire = true;
        }
        return isRequire;
    }

    //Validate company phone
    public boolean CheckCompanyPhone(EditText editText) {
        boolean check = false;
        if (editText.getText().length() < 6) {
            check = true;
        }
        return check;
    }

    // Validate contact phone
    public String CheckContactNo(String editTextContactNo) {
        if (editTextContactNo.length() == 0) {
            return "null";
        } else {
            String expression = "^(\\+61|0061|0)?4[0-9]{8}$";
            Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(editTextContactNo);
            if (matcher.matches()) {
                String mobile = null;
                String subStringMobile = editTextContactNo.substring(0, 4);
                if (subStringMobile.equalsIgnoreCase("0061")) {
                    mobile = getResources().getString(R.string.australiaFormatPhone) +
                            editTextContactNo.substring(4, editTextContactNo.length());
                } else {
                    char subPhone = editTextContactNo.charAt(0);
                    switch (subPhone) {
                        case '0':
                            mobile = getResources().getString(R.string.australiaFormatPhone) + editTextContactNo.substring(1);
                            break;
                        case '4':
                            mobile = getResources().getString(R.string.australiaFormatPhone) + editTextContactNo;
                            break;
                    }
                }
                return mobile;
            } else {
                return "error";
            }
        }
    }

    // Validate email
    public boolean IsEmailValid(EditText editText) {
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
    public void onBackPressed() {
        startActivity(new Intent(this, HomeActivity.class));
        finish();
    }
}
