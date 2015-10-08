package com.redimed.urgentcare;

import android.annotation.TargetApi;
import android.app.DatePickerDialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Display;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.ScrollView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.redimed.urgentcare.api.UrgentRequestApi;
import com.redimed.urgentcare.models.UrgentRequestModel;
import com.redimed.urgentcare.utils.BlurTransformation;
import com.redimed.urgentcare.utils.CreateDatePicker;
import com.redimed.urgentcare.utils.RetrofitClient;
import com.redimed.urgentcare.utils.TableRadioGroup;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class WorkInjuryActivity extends AppCompatActivity implements CreateDatePicker.OnCompleteListener{
    @Bind(R.id.txtFirstName) EditText txtFirstName;
    @Bind(R.id.txtLastName) EditText txtLastName;
    @Bind(R.id.txtContactPhone) EditText txtContactPhone;
    @Bind(R.id.txtDOB) EditText txtDOB;
    @Bind(R.id.txtEmail) EditText txtEmail;
    @Bind(R.id.txtDescription) EditText txtDescription;
    @Bind(R.id.radioGroupUrgentRequestType) TableRadioGroup radioGroupUrgentRequestType;
    @Bind(R.id.scrollViewWorkInjury) ScrollView scrollViewWorkInjury;
    @Bind(R.id.btnCloseWorkInjuryPage) Button btnCloseWorkInjuryPage;
    @Bind(R.id.btnWorkInjury) Button btnWorkInjury;
    @Bind(R.id.autoCompleteSuburb) AutoCompleteTextView autoCompleteSuburb;
    @Bind(R.id.imgBackgroundWorkInjury) ImageView imgBackgroundWorkInjury;
    @Bind(R.id.txtCompanyName) EditText txtCompanyName;
    @Bind(R.id.txtContactPerson) EditText txtContactPerson;
    @Bind(R.id.txtCompanyPhone) EditText txtCompanyPhone;
    String[] surburb;
    Gson gson = new Gson();

    //img
    private static final int BACKGROUND_IMAGES_WIDTH = 360;
    private static final int BACKGROUND_IMAGES_HEIGHT = 360;
    private static final float BLUR_RADIUS = 25F;

    private BlurTransformation blurTransformation;
    private int backgroundIndex;
    private Point backgroundImageTargetSize;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_work_injury);
//        getList();
        // Initialize default values
        ButterKnife.bind(this);
        mReadJsonData();
        // Initialize controls
        EditText[] allEditTextEventOnTouchListener = {txtFirstName,txtLastName,txtContactPhone,txtDOB,autoCompleteSuburb,txtEmail,txtDescription,txtCompanyPhone,txtContactPerson,txtCompanyName};
        OnTouchListenerRelativeLayout(scrollViewWorkInjury, allEditTextEventOnTouchListener);
        TxtDOBCreateDatePicker(txtDOB);
        CloseMakeAppointmentPage(btnCloseWorkInjuryPage);
        EditText[] allEditTextCheckRequire = {txtFirstName,txtLastName,txtContactPhone,txtCompanyName,txtContactPerson};
        SendMakeAppointment(btnWorkInjury, allEditTextCheckRequire);
        EdittextValidateFocus(allEditTextCheckRequire);
//        blurTransformation = new BlurTransformation(this, BLUR_RADIUS);
//        backgroundImageTargetSize = calculateBackgroundImageSizeCroppedToScreenAspectRatio(
//        getWindowManager().getDefaultDisplay());
//        Picasso.with(this).load(R.drawable.bg_work_injury)
//        .resize(backgroundImageTargetSize.x, backgroundImageTargetSize.y).centerCrop()
//        .transform(blurTransformation).into(imgBackgroundWorkInjury);

    }

    public void mReadJsonData() {
        try {
            File f = new File("/data/data/" + getPackageName() + "/" + "suburb.json");
            if  (f.exists()){
                FileInputStream is = new FileInputStream(f);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);
                Log.d("roine",mResponse);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);

                surburb = gson.fromJson(obj.get("data"), String[].class);
                Log.d("nene",obj.get("data").toString());
                ArrayAdapter adapter = new ArrayAdapter(WorkInjuryActivity.this,android.R.layout.simple_list_item_1,surburb);
                autoCompleteSuburb.setAdapter(adapter);
                autoCompleteSuburb.setThreshold(1);
            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void getList(){

        UrgentRequestApi urgentApi = RetrofitClient.createService(UrgentRequestApi.class);
        urgentApi.getListSuburb(new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                surburb = gson.fromJson(jsonObject.get("data"), String[].class);
                ArrayAdapter adapter = new ArrayAdapter(WorkInjuryActivity.this,android.R.layout.simple_list_item_2,surburb);
                autoCompleteSuburb.setAdapter(adapter);
                autoCompleteSuburb.setThreshold(1);
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });
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
                            editTextFocus.setError(editTextFocus.getHint()+" is required!", customErrorDrawable);
                        } else {
                            editTextFocus.setError(null);
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
                        txtContactPhone.setError("Contact Phone is required!", customErrorDrawable);
                    } else if (CheckContactNo(txtContactPhone) == "error") {
                        txtContactPhone.setError("Contact Phone wrong formatted", customErrorDrawable);
                    } else {
                        txtContactPhone.setError(null);
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
                        txtEmail.setError("Email address not valid", customErrorDrawable);
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
                arrayEditTextCheckRequired[i].setError(arrayEditTextCheckRequired[i].getHint()+" is required!", customErrorDrawable);
                validate = false;
            }else {
                arrayEditTextCheckRequired[i].setError(null);
            }
        }
        //validate phone number
        // australian phonenumer: 10digits (0X YYYY YYYY)
        if (CheckContactNo(txtContactPhone) == "null"){
            txtContactPhone.setError("Contact No is required!", customErrorDrawable);
            validate = false;
        }else if (CheckContactNo(txtContactPhone) == "error"){
            txtContactPhone.setError("Contact No wrong formatted",customErrorDrawable);
            validate = false;
        }else {
            txtContactPhone.setError(null);
        }
        //validate email format
        if (!IsEmailValid(txtEmail) && txtEmail.getText().length() > 0){
            txtEmail.setError("Email address not valid",customErrorDrawable);
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

    public void SendMakeAppointment(Button btn, final EditText[] arr){
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!CheckValidateFrom(arr)) {
                    return;
                }
                // Initialize objectUrgentRequest
                UrgentRequestModel objectUrgentRequest = new UrgentRequestModel();
                objectUrgentRequest.setFirstName(txtFirstName.getText().toString());
                objectUrgentRequest.setLastName(txtLastName.getText().toString());
                objectUrgentRequest.setContactPhone(
                        getResources().getString(R.string.australiaFormatPhone) + txtContactPhone.getText().toString()
                );
                objectUrgentRequest.setDOB(txtDOB.getText().toString());
                objectUrgentRequest.setEmail(txtEmail.getText().toString());
                objectUrgentRequest.setDescription(txtDescription.getText().toString());
                objectUrgentRequest.setUrgentRequestType(((RadioButton) findViewById(radioGroupUrgentRequestType.getCheckedRadioButtonId())).getHint().toString());
                objectUrgentRequest.setServiceType(getResources().getString(R.string.serviceWorkInjury));
                objectUrgentRequest.setCompanyName(txtCompanyName.getText().toString());
                objectUrgentRequest.setContactPerson(txtContactPerson.getText().toString());
                objectUrgentRequest.setCompanyPhone(txtCompanyPhone.getText().toString());
                objectUrgentRequest.setSuburb(autoCompleteSuburb.getText().toString());




                //send make appointment
                Gson gson = new Gson();
                JsonObject jsonUrgentRequest = new JsonObject();
                jsonUrgentRequest.addProperty(
                        getResources().getString(R.string.jsonTitleSendAppointment),
                        gson.toJson(objectUrgentRequest)
                );

                final SweetAlertDialog progressDialog = new SweetAlertDialog(WorkInjuryActivity.this, SweetAlertDialog.PROGRESS_TYPE);
                progressDialog.getProgressHelper().setBarColor(Color.parseColor("#A5DC86"));
                progressDialog.setTitleText(getResources().getString(R.string.progressMakeAppointmentContent));
                progressDialog.setCancelable(false);
                progressDialog.show();

                UrgentRequestApi urgentApi = RetrofitClient.createService(UrgentRequestApi.class);
                urgentApi.sendUrgentRequest(jsonUrgentRequest, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        progressDialog.dismissWithAnimation();
                        SweetAlertDialog pDialog = new SweetAlertDialog(WorkInjuryActivity.this, SweetAlertDialog.SUCCESS_TYPE);
                        pDialog.setTitleText(getResources().getString(R.string.dailogSuccess));
                        pDialog.setContentText(getResources().getString(R.string.contentDialogSuccessAppointment));
                        pDialog.setCancelable(false);
                        pDialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                            @Override
                            public void onClick(SweetAlertDialog sDialog) {
                                finish();
                            }
                        });
                        pDialog.show();
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        progressDialog.dismissWithAnimation();
                        SweetAlertDialog eDialog = new SweetAlertDialog(WorkInjuryActivity.this, SweetAlertDialog.ERROR_TYPE);
                        eDialog.setTitleText(getResources().getString(R.string.dailogError));
                        eDialog.setContentText(getResources().getString(R.string.contentDialogErrorAppointment));
                        eDialog.setCancelable(false);
                        eDialog.setConfirmClickListener(new SweetAlertDialog.OnSweetClickListener() {
                            @Override
                            public void onClick(SweetAlertDialog sDialog) {
                                finish();
                            }
                        });
                        eDialog.show();
                    }
                });
            }
        });
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

    public void CloseMakeAppointmentPage(Button btn){
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    public void CreatePopupDatePicker(){
        CreateDatePicker datepicker = new CreateDatePicker();
        datepicker.show(getSupportFragmentManager(), "date_picker");
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

    DatePickerDialog.OnDateSetListener a = new DatePickerDialog.OnDateSetListener() {
        @Override
        public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
            Toast.makeText(
                    WorkInjuryActivity.this,
                    dayOfMonth + "/" + monthOfYear + "/" + year,
                    Toast.LENGTH_LONG
            ).show();
            txtDOB.setText(dayOfMonth+"/"+monthOfYear+"/"+year);
        }
    };

    public String setDate(){
        return txtDOB.getText().toString();
    }
    @Override
    public void onComplete(String date) {
        txtDOB.setText(date);
    }

    //img
    private static Point calculateBackgroundImageSizeCroppedToScreenAspectRatio(Display display) {
        final Point screenSize = new Point();
        getSizeCompat(display, screenSize);
        int scaledWidth = (int) (((double) BACKGROUND_IMAGES_HEIGHT * screenSize.x) / screenSize.y);
        int croppedWidth = Math.min(scaledWidth, BACKGROUND_IMAGES_WIDTH);
        int scaledHeight = (int) (((double) BACKGROUND_IMAGES_WIDTH * screenSize.y) / screenSize.x);
        int croppedHeight = Math.min(scaledHeight, BACKGROUND_IMAGES_HEIGHT);
        return new Point(croppedWidth, croppedHeight);
    }
    @SuppressWarnings("deprecation")
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private static void getSizeCompat(Display display, Point screenSize) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            display.getSize(screenSize);
        } else {
            screenSize.x = display.getWidth();
            screenSize.y = display.getHeight();
        }
    }
}
