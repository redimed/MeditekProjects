package com.redimed.urgentcare;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.ScrollView;

import com.andexert.library.RippleView;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.redimed.urgentcare.api.UrgentRequestApi;
import com.redimed.urgentcare.models.UrgentRequestModel;
import com.redimed.urgentcare.utils.CreateDatePicker;
import com.redimed.urgentcare.utils.RetrofitClient;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class OrthopaedicActivity extends AppCompatActivity implements CreateDatePicker.OnCompleteListener {
    @Bind(R.id.txtFirstName) EditText txtFirstName;
    @Bind(R.id.txtLastName) EditText txtLastName;
    @Bind(R.id.txtContactPhone) EditText txtContactPhone;
    @Bind(R.id.txtDOB) EditText txtDOB;
    @Bind(R.id.txtEmail) EditText txtEmail;
    @Bind(R.id.txtDescription) EditText txtDescription;
    @Bind(R.id.radioGroupGPReferral) RadioGroup radioGroupGPReferral;
    @Bind(R.id.scrollViewOrthopaedic) ScrollView scrollViewOrthopaedic;
    @Bind(R.id.rippleViewCloseOrthopaedicPage) RippleView rippleViewCloseOrthopaedicPage;
    @Bind(R.id.rippleViewBtnOrthopaedic) RippleView rippleViewBtnOrthopaedic;
    @Bind(R.id.autoCompleteSuburb) AutoCompleteTextView autoCompleteSuburb;
    @Bind(R.id.checkboxHandTherapy) CheckBox checkboxHandTherapy;
    @Bind(R.id.checkboxPhysiotherapy) CheckBox checkboxPhysiotherapy;
    @Bind(R.id.checkboxSpecialist) CheckBox checkboxSpecialist;
    String[] surburb;
    Gson gson = new Gson();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_orthopaedic);
        // Initialize default values
        ButterKnife.bind(this);
        loadDataInformation();
        mReadJsonData();
        // Initialize controls
        EditText[] allEditTextEventOnTouchListener = {txtFirstName,txtLastName,txtDOB,txtContactPhone,txtEmail,txtDescription,autoCompleteSuburb};
        OnTouchListenerRelativeLayout(scrollViewOrthopaedic, allEditTextEventOnTouchListener);
        TxtDOBCreateDatePicker(txtDOB);
        CloseMakeAppointmentPage(rippleViewCloseOrthopaedicPage);
        EditText[] allEditTextCheckRequire = {txtFirstName,txtLastName};
        SendMakeAppointment(rippleViewBtnOrthopaedic, allEditTextCheckRequire);
        EdittextValidateFocus(allEditTextCheckRequire);
    }
    public void loadDataInformation(){
        SharedPreferences preferences = getSharedPreferences("information", MODE_PRIVATE);
        txtFirstName.setText(preferences.getString("FirstName",""));
        txtLastName.setText(preferences.getString("LastName", ""));
        txtContactPhone.setText(preferences.getString("ContactPhone", ""));
        autoCompleteSuburb.setText(preferences.getString("Suburb", ""));
        txtDOB.setText(preferences.getString("DOB", ""));
        txtEmail.setText(preferences.getString("Email", ""));
    }

    public void mReadJsonData() {
        try {
            File f = new File(getStringValue(R.string.urlFile) + getPackageName() + getStringValue(R.string.fileName));
            if  (f.exists()){
                FileInputStream is = new FileInputStream(f);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);

                surburb = gson.fromJson(obj.get("data"), String[].class);
                ArrayAdapter adapter = new ArrayAdapter(OrthopaedicActivity.this,android.R.layout.simple_list_item_1,surburb);
                autoCompleteSuburb.setAdapter(adapter);
                autoCompleteSuburb.setThreshold(1);
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public String getStringValue(int id){
        return getResources().getString(id);
    }

    //validate all EditText when outfocus
    public void EdittextValidateFocus(EditText[] edt){
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.ic_edittext_error);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());

        //validate EditText required
        for (int i=0;i<edt.length;i++){
            final EditText editTextFocus = edt[i];
            editTextFocus.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                @Override
                public void onFocusChange(View v, boolean hasFocus) {
                    if (!hasFocus) {
                        if (CheckRequiredData(editTextFocus)) {
                            editTextFocus.setError(editTextFocus.getHint()+" "+ getStringValue(R.string.isRequired), customErrorDrawable);
                        } else {
                            editTextFocus.setError(null);
                            editTextFocus.setText(capFirstLetter(editTextFocus.getText().toString()));
                        }
                    }
                }
            });
        }
        //validate contact phone
        txtContactPhone.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus) {
                    if (CheckContactNo(txtContactPhone) == "null") {
                        txtContactPhone.setError(getStringValue(R.string.contactPhoneRequired), customErrorDrawable);
                    } else if (CheckContactNo(txtContactPhone) == "error") {
                        txtContactPhone.setError(getStringValue(R.string.contactPhoneFormat), customErrorDrawable);
                    } else {
                        txtContactPhone.setError(null);
                    }
                }
            }
        });

        autoCompleteSuburb.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus){
                    if (autoCompleteSuburb.getText().length() >0 ){
                        autoCompleteSuburb.setText(capFirstLetter(autoCompleteSuburb.getText().toString()));
                    }
                }
            }
        });
        txtDescription.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus){
                    if (txtDescription.getText().length() >0){
                        txtDescription.setText(capFirstLetter(txtDescription.getText().toString()));
                    }
                }
            }
        });

        //validate email
        txtEmail.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus) {
                    if (!IsEmailValid(txtEmail) && txtEmail.getText().length() > 0) {
                        txtEmail.setError(getStringValue(R.string.emailValid), customErrorDrawable);
                    } else {
                        txtEmail.setError(null);
                    }
                }
            }
        });
    }

    //validate from
    public boolean CheckValidateFrom(EditText[] arrayEditTextCheckRequired){
        //initialize buttons
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.ic_edittext_error);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());

        boolean validate = true;
        //validation
        for (int i=0; i<arrayEditTextCheckRequired.length;i++){
            if (CheckRequiredData(arrayEditTextCheckRequired[i])) {
                arrayEditTextCheckRequired[i].setError(arrayEditTextCheckRequired[i].getHint()+" "+ getStringValue(R.string.isRequired), customErrorDrawable);
                validate = false;
            }else {
                arrayEditTextCheckRequired[i].setError(null);
            }
        }
        //validate phone number
        // australian phonenumer: 10digits (0X YYYY YYYY)
        if (CheckContactNo(txtContactPhone) == "null"){
            txtContactPhone.setError(getStringValue(R.string.contactPhoneRequired), customErrorDrawable);
            validate = false;
        }else if (CheckContactNo(txtContactPhone) == "error"){
            txtContactPhone.setError(getStringValue(R.string.contactPhoneFormat),customErrorDrawable);
            validate = false;
        }else {
            txtContactPhone.setError(null);
        }
        //validate email format
        if (!IsEmailValid(txtEmail) && txtEmail.getText().length() > 0){
            txtEmail.setError(getStringValue(R.string.emailValid),customErrorDrawable);
            validate = false;
        }else {
            txtEmail.setError(null);
        }
        return validate;
    }
    //validate email
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

    //validate require
    public boolean CheckRequiredData(EditText editText){
        boolean isRequire = false;
        if (editText.getText().length() == 0){
            isRequire = true;
        }
        return isRequire;
    }

    //validate contact phone
    public String CheckContactNo (EditText editTextContactNo){
        if (CheckRequiredData(editTextContactNo)) {
            return "null";
        } else {
            if (editTextContactNo.getText().length() < 9){
                return "error";
            }else if (editTextContactNo.getText().length() == 9){
                int firstPhone = Integer.parseInt(editTextContactNo.getText().toString().substring(0, 1));
                if (firstPhone == 0){
                    return "error";
                }
            }else if (editTextContactNo.getText().length() == 10){
                int firstPhone = Integer.parseInt(editTextContactNo.getText().toString().substring(0, 1));
                if (firstPhone != 0){
                    return "error";
                }
            }
        }
        return "true";
    }

    //SendMakeAppointment
    //input: Urgent care request infomation
    //output: new urgent care request
    public void SendMakeAppointment(RippleView rv, final EditText[] arr){
        rv.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                if (!CheckValidateFrom(arr)) {
                    SweetAlertDialog eFDialog = new SweetAlertDialog(OrthopaedicActivity.this, SweetAlertDialog.ERROR_TYPE);
                    eFDialog.setTitleText(getResources().getString(R.string.dailogError));
                    eFDialog.setContentText(getResources().getString(R.string.contentDialogErrorFrom));
                    eFDialog.setCancelable(false);
                    eFDialog.show();
                    return;
                }
                // Initialize objectUrgentRequest
                UrgentRequestModel objectUrgentRequest = new UrgentRequestModel();
                objectUrgentRequest.setFirstName(txtFirstName.getText().toString());
                objectUrgentRequest.setLastName(txtLastName.getText().toString());
                objectUrgentRequest.setContactPhone(
                        getResources().getString(R.string.australiaFormatPhone) + txtContactPhone.getText().toString()
                );
                if (txtDOB.length() > 0) {
                    StringTokenizer st = new StringTokenizer(txtDOB.getText().toString(), "/");
                    List<Integer> myList = new ArrayList<Integer>();
                    while (st.hasMoreTokens()) {
                        myList.add(Integer.parseInt(st.nextToken()));
                    }
                    objectUrgentRequest.setDOB(myList.get(2) + "-" + myList.get(1) + "-" + myList.get(0));
                }
                objectUrgentRequest.setEmail(txtEmail.getText().toString());
                objectUrgentRequest.setDescription(txtDescription.getText().toString());
                objectUrgentRequest.setGpReferral((radioGroupGPReferral.getCheckedRadioButtonId() == -1) ? null : ((RadioButton) findViewById(radioGroupGPReferral.getCheckedRadioButtonId())).getHint().toString());
                objectUrgentRequest.setHandTherapy((checkboxHandTherapy.isChecked() != true) ? "N" : "Y");
                objectUrgentRequest.setPhysiotherapy((checkboxPhysiotherapy.isChecked() != true) ? "N" : "Y");
                objectUrgentRequest.setSpecialist((checkboxSpecialist.isChecked() != true) ? "N" : "Y");
                objectUrgentRequest.setServiceType(getResources().getString(R.string.serviceUrgentCare));
                objectUrgentRequest.setRequestDate(new SimpleDateFormat("yyyy/MM/dd HH:mm:ss Z").format(new Date()));
                objectUrgentRequest.setSuburb(autoCompleteSuburb.getText().toString());
                // Make Appointment Process
                final SweetAlertDialog progressDialog = new SweetAlertDialog(OrthopaedicActivity.this, SweetAlertDialog.PROGRESS_TYPE);
                progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
                progressDialog.setTitleText(getResources().getString(R.string.progressMakeAppointmentContent));
                progressDialog.setCancelable(false);
                progressDialog.show();

                //send make appointment
                Gson gson = new Gson();
                JsonObject jsonUrgentRequest = new JsonObject();
                jsonUrgentRequest.addProperty(
                        getResources().getString(R.string.jsonTitleSendAppointment),
                        gson.toJson(objectUrgentRequest)
                );

                UrgentRequestApi urgentApi = RetrofitClient.createService(UrgentRequestApi.class);
                urgentApi.sendUrgentRequest(jsonUrgentRequest, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        progressDialog.dismissWithAnimation();
                        File f = new File("/data/data/" + getPackageName() + "/shared_prefs/information.xml");
                        SharedPreferences preferences = getSharedPreferences("information", MODE_PRIVATE);
                        final SweetAlertDialog pDialog = new SweetAlertDialog(OrthopaedicActivity.this, SweetAlertDialog.SUCCESS_TYPE);
                        pDialog.setTitleText(getResources().getString(R.string.dailogSuccess));
                        pDialog.setContentText(getResources().getString(R.string.contentDialogSuccessAppointment));
                        pDialog.setCancelClickListener(new SweetAlertDialog.OnSweetClickListener() {
                            @Override
                            public void onClick(SweetAlertDialog sDialog) {
                                finish();
                            }
                        });
                        if (f.exists()) {
                            CheckInfomation(pDialog, preferences);
                        } else {
                            SaveInfomation(pDialog, preferences);
                        }
                        pDialog.show();
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        progressDialog.dismissWithAnimation();
                        SweetAlertDialog errorDialog = new SweetAlertDialog(OrthopaedicActivity.this, SweetAlertDialog.ERROR_TYPE);
                        errorDialog.setTitleText(getResources().getString(R.string.dailogError));
                        errorDialog.setContentText(getResources().getString(R.string.contentDialogErrorAppointment));
                        errorDialog.setCancelable(false);
                        errorDialog.show();
                    }
                });
            }
        });
    }

    public void SaveInfomation(final SweetAlertDialog d, final SharedPreferences p){
        d.setCancelText("Ok");
        d.setCancelClickListener(new SweetAlertDialog.OnSweetClickListener() {
            @Override
            public void onClick(SweetAlertDialog sweetAlertDialog) {
                finish();
            }
        });
        d.setConfirmText("Save information");
        d.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
            @Override
            public void onClick(SweetAlertDialog sDialog) {
                SharedPreferences.Editor editor = p.edit();
                editor.putString("FirstName", txtFirstName.getText().toString());
                editor.putString("LastName", txtLastName.getText().toString());
                editor.putString("ContactPhone", txtContactPhone.getText().toString());
                editor.putString("Suburb", autoCompleteSuburb.getText().toString());
                editor.putString("DOB", txtDOB.getText().toString());
                editor.putString("Email", txtEmail.getText().toString());
                editor.commit();
                finish();
            }
        });
    }

    public void CheckInfomation(final SweetAlertDialog d, SharedPreferences p){
        if (!txtFirstName.getText().toString().trim().equalsIgnoreCase(p.getString("FirstName","").trim())
                || !txtLastName.getText().toString().trim().equalsIgnoreCase(p.getString("LastName","").trim())
                || !txtContactPhone.getText().toString().trim().equalsIgnoreCase(p.getString("ContactPhone","").trim())
                || !autoCompleteSuburb.getText().toString().trim().equalsIgnoreCase(p.getString("Suburb","").trim())
                || !txtDOB.getText().toString().trim().equalsIgnoreCase(p.getString("DOB","").trim())
                || !txtEmail.getText().toString().trim().equalsIgnoreCase(p.getString("Email","").trim()))
        {
            SaveInfomation(d, p);
        }
    }

    //OnTouchListenerRelativeLayout
    // Hide keyboard when outfocus controls
    public void OnTouchListenerRelativeLayout(ScrollView relativeLayout,final EditText[] editTextArray){
        relativeLayout.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    for (int i = 0; i < editTextArray.length; i++) {
                        if (editTextArray[i].isFocused()) {
                            Rect outRect = new Rect();
                            editTextArray[i].getGlobalVisibleRect(outRect);
                            if (!outRect.contains((int) event.getRawX(), (int) event.getRawY())) {
                                InputMethodManager imm = (InputMethodManager) v.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                                imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                            }
                        }
                    }
                }
                return false;
            }
        });
    }

    public void CloseMakeAppointmentPage(RippleView rv){
        rv.setOnRippleCompleteListener(new RippleView.OnRippleCompleteListener() {
            @Override
            public void onComplete(RippleView rippleView) {
                finish();
            }
        });
    }

    //CreatePopupDatePicker: show popup date picker
    public void CreatePopupDatePicker(){
        CreateDatePicker datepicker = new CreateDatePicker();

        datepicker.show(getSupportFragmentManager(), "date_picker");
    }

    //Upper case first string
    public static String capFirstLetter(String input) {
        return input.substring(0,1).toUpperCase() + input.substring(1,input.length());
    }

    public void HideKeyBoard(EditText editText){
        InputMethodManager mgr = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        mgr.hideSoftInputFromWindow(editText.getWindowToken(), 0);
    }

    public void TxtDOBCreateDatePicker(final EditText editText){
        editText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    HideKeyBoard(editText);
                    CreatePopupDatePicker();
                }
            }
        });

        editText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                HideKeyBoard(editText);
                CreatePopupDatePicker();
            }
        });
    }
    public String setDate(){
        return txtDOB.getText().toString();
    }
    @Override
    public void onComplete(String date) {
        txtDOB.setText(date);
    }

}
