package com.example.phanq.meditekapp;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.ViewFlipper;

import com.example.phanq.meditekapp.API.ungentapi;
import com.example.phanq.meditekapp.model.ungentmodel;
import com.example.phanq.meditekapp.utils.DatePickerFragment;
import com.example.phanq.meditekapp.utils.DoneOnEditorActionListener;
import com.example.phanq.meditekapp.utils.ServiceGenerator;
import com.example.phanq.meditekapp.utils.ViewDialog;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class UngentPage extends FragmentActivity {
    //  EditText
    @Bind(R.id.editTextFirstName) EditText edtFirstName;
    @Bind(R.id.editTextLastName) EditText edtLastName;
    @Bind(R.id.editTextContactNo) EditText edtContactNo;
    @Bind(R.id.editTextDescription) EditText edtDescription;
    @Bind(R.id.editTextEmail) EditText edtEmail;
    @Bind(R.id.editTextDOB) EditText edtDOB;
    @Bind(R.id.editTextAddress) EditText edtAddress1;
    @Bind(R.id.editTextAddress2) EditText edtAddress2;
    @Bind(R.id.editTextSuburb) EditText edtSuburb;
    @Bind(R.id.editTextPostCode) EditText edtPostCode;
    //  RadioGroup
    @Bind(R.id.RadioGroupGender) RadioGroup rdgGender;
    //  TextView
    @Bind(R.id.textViewNext) TextView txtvNextPage;
    @Bind(R.id.textViewPrevious) TextView txtvPreviousPage;
    //  Button
    @Bind(R.id.buttonBack) Button btnBack;
    @Bind(R.id.buttonSubmit) Button btnSubmit;
    //  ViewFlipper
    @Bind(R.id.flipper) ViewFlipper viewflipper;
    //  Spinner
    @Bind(R.id.spinnerState) Spinner snpstate;
    //  RelativeLayout
    @Bind(R.id.relativeLayoutUngent) RelativeLayout rltUngent;

    //  ProgressDialog
    ProgressDialog progress;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ungent_page);
        ButterKnife.bind(this);

        //set list EditText button done
        EditText[] arrayEditTextFrom = {edtFirstName,edtLastName,edtContactNo,edtDescription,edtEmail,edtAddress1,edtAddress2,edtSuburb,edtPostCode};
        CreateButtonDoneInKayBoard(arrayEditTextFrom);

        //config list EditText function focus
        EditText[] arrayEditTextRequired = {edtFirstName,edtLastName,edtContactNo,edtDescription};
        EdittextValidateFocus(arrayEditTextRequired);

        //config list EditText function OnTouchListener
        OnTouchListenerRelativeLayout(rltUngent, arrayEditTextFrom);

        //set animation change page
        AnimationChangePage(txtvNextPage, txtvPreviousPage);

        //hidden kayboard
        CheckRadioButton(rdgGender);

        //set popup date picker dob
        ShowDatePickerDOB(edtDOB);

        //set button close Page
        ClosePage(btnBack);

        // submit from
        SubmitFrom(arrayEditTextRequired);
    }
    //check radio button
    public void CheckRadioButton(RadioGroup radioGroup){
        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                InputMethodManager imm = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
                imm.toggleSoftInput(InputMethodManager.HIDE_IMPLICIT_ONLY, 0);
            }
        });
    }
    //submit from
    public void SubmitFrom(final EditText[] arrayEditTextRequired){
        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @TargetApi(Build.VERSION_CODES.LOLLIPOP)
            @Override
            public void onClick(View v) {
                //check validate
                if (!CheckValidateFrom(arrayEditTextRequired)) {
                    return;
                }

                ungentmodel object = new ungentmodel();
                object.setFirstName(edtFirstName.getText().toString());
                object.setLastName(edtLastName.getText().toString());
                object.setContactNo(edtContactNo.getText().toString());
                //get value radio button
                String radiovalue = ((RadioButton) findViewById(rdgGender.getCheckedRadioButtonId())).getText().toString();
                object.setGender(radiovalue);
                object.setDescription(edtDescription.getText().toString());
                object.setEmail(edtEmail.getText().toString());
                object.setDob(edtDOB.getText().toString());
                object.setAddress1(edtAddress1.getText().toString());
                object.setAddress2(edtAddress2.getText().toString());
                object.setSuburb(edtSuburb.getText().toString());
                object.setPostCode(edtPostCode.getText().toString());
                object.setState(snpstate.getSelectedItem().toString());
                //dialog wati..
                progress = ProgressDialog.show(UngentPage.this, "Make Appointment", "Please wait..");
                Gson gson = new Gson();
                JsonObject json = new JsonObject();
                json.addProperty("data", gson.toJson(object));
                ungentapi api = ServiceGenerator.createService(ungentapi.class);
                api.getPeed(json, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        progress.dismiss();
                        ViewDialog dialog = new ViewDialog();
                        dialog.showDialog(UngentPage.this, "Send make appointment success!",R.layout.dialogsuccess);
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        progress.dismiss();
                        ViewDialog dialog = new ViewDialog();
                        dialog.showDialog(UngentPage.this, "Send make appointment error!2",R.layout.dialogerror);
                    }
                });
            }
        });
    }

    //check validate from
    public boolean CheckValidateFrom(EditText[] arrayEditTextCheckRequired){
        //config icon error
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.error);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());
        //config icon success
        final Drawable customSuccessDrawable = getResources().getDrawable(R.drawable.success);
        customSuccessDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());

        boolean validate = true;
        //check required
        for (int i=0; i<arrayEditTextCheckRequired.length;i++){
            if (CheckRequiredData(arrayEditTextCheckRequired[i])) {
                arrayEditTextCheckRequired[i].setError(arrayEditTextCheckRequired[i].getHint()+" is required!", customErrorDrawable);
                validate = false;
            }else {
                arrayEditTextCheckRequired[i].setError(null);
            }
        }
        //check contact no
        if (CheckContactNo(edtContactNo) == "null"){
            edtContactNo.setError("Contact No is required!", customErrorDrawable);
            validate = false;
        }else if (CheckContactNo(edtContactNo) == "error"){
            edtContactNo.setError("Contact No wrong formatted",customErrorDrawable);
            validate = false;
        }else {
            edtContactNo.setError(null);
        }
        //check email
            if (!IsEmailValid(edtEmail) && edtEmail.getText().length() > 0){
            edtEmail.setError("Email address not valid",customErrorDrawable);
            validate = false;
        }else {
            edtEmail.setError(null);
        }
        //check postcode
        if (CheckPostCode(edtPostCode)){
            edtPostCode.setError("PostCode wrong formatted",customErrorDrawable);
            validate = false;
        }else {
            edtPostCode.setError(null);
        }
        return validate;
    }

    //create button done in kayboard
    public void CreateButtonDoneInKayBoard(EditText[] arrayEditText){
        for (int i=0; i< arrayEditText.length; i++ ){
            arrayEditText[i].setOnEditorActionListener(new DoneOnEditorActionListener());
        }
    }

    //close page
    public void ClosePage(Button button){
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
    }

    //create animation
    public void AnimationChangePage(TextView nextPage,TextView previousPage){
        //set animation
        final Animation slideInLeft, slideInRight, slideOutLeft, slideOutRight;
        slideInLeft = AnimationUtils.loadAnimation(this,R.anim.in_from_left);
        slideInRight = AnimationUtils.loadAnimation(this,R.anim.in_from_right);
        slideOutRight = AnimationUtils.loadAnimation(this,R.anim.out_to_right);
        slideOutLeft = AnimationUtils.loadAnimation(this,R.anim.out_to_left);

        nextPage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewflipper.setInAnimation(slideInRight);
                viewflipper.setOutAnimation(slideOutLeft);
                viewflipper.showNext();
            }
        });

        previousPage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                viewflipper.setOutAnimation(slideOutRight);
                viewflipper.setInAnimation(slideInLeft);
                viewflipper.showPrevious();
            }
        });

    }


    //output : hidden kayboard on click RelativeLayout
    public void OnTouchListenerRelativeLayout(RelativeLayout relativeLayout,final EditText[] editTextArray){
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

    //check validate array edittext out focus
    public void EdittextValidateFocus(EditText[] edt){
        //config icon error
        final Drawable customErrorDrawable = getResources().getDrawable(R.drawable.error);
        customErrorDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());
        //config icon success
        final Drawable customSuccessDrawable = getResources().getDrawable(R.drawable.success);
        customSuccessDrawable.setBounds(0, 0, customErrorDrawable.getIntrinsicWidth(), customErrorDrawable.getIntrinsicHeight());

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

        //set contact no
        edtContactNo.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (!hasFocus) {
                    if (CheckContactNo(edtContactNo) == "null"){
                        edtContactNo.setError("Contact No is required!", customErrorDrawable);
                    }else if (CheckContactNo(edtContactNo) == "error"){
                        edtContactNo.setError("Contact No wrong formatted",customErrorDrawable);
                    }else {
                        edtContactNo.setError(null);
                    }
                }
            }
        });

        //set email
        edtEmail.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if(!hasFocus){
                    if (!IsEmailValid(edtEmail) && edtEmail.getText().length() > 0){
                        edtEmail.setError("Email address not valid",customErrorDrawable);
                    }else {
                        edtEmail.setError(null);
                    }
                }
            }
        });

        //set post code
        edtPostCode.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if(!hasFocus){
                    if (CheckPostCode(edtPostCode)){
                        edtPostCode.setError("PostCode wrong formatted",customErrorDrawable);
                    }else {
                        edtPostCode.setError(null);
                    }
                }
            }
        });
    }
    // hiden kayboard
    public void HiddenKayBoard(EditText editText){
        InputMethodManager mgr = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        mgr.hideSoftInputFromWindow(editText.getWindowToken(), 0);
    }
    // show popup date picker
    public void CreateDatePicker(){
        DatePickerFragment datepicker = new DatePickerFragment();
        datepicker.show(getSupportFragmentManager(), "date_picker");
    }
    //  output: popup date picker
    public void ShowDatePickerDOB(final EditText editText){
        editText.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    HiddenKayBoard(editText);
                    CreateDatePicker();
                }
            }
        });

        editText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                HiddenKayBoard(editText);
                CreateDatePicker();
            }
        });
    }

    //  IsEmailValid
    //  input: string
    //  output: type email (true) or not email (false)
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

    //  CheckRequiredData
    //  input: string
    //  output: require(true) and not require(false)
    public boolean CheckRequiredData(EditText editText){
        boolean isRequire = false;
        if (editText.getText().length() == 0){
            isRequire = true;
        }
        return isRequire;
    }
    //check post code
    public boolean CheckPostCode(EditText editText){
        if (editText.getText().length() < 4 && editText.getText().length() >0){
            return true;
        }else {
            return false;
        }
    }



    //check phone number
    public String CheckContactNo (EditText editTextContactNo){
        if (CheckRequiredData(editTextContactNo)) {
            return "null";
        } else {
            //contactno nho hon chin chu so
            if (editTextContactNo.getText().length() < 9){
                return "error";
                //if contactno bang chin chu so
            }else if (editTextContactNo.getText().length() == 9){
                int firstPhone = Integer.parseInt(editTextContactNo.getText().toString().substring(0, 1));
                //if contactno bat dau bang so khong
                if (firstPhone == 0){
                    return "error";
                }
                //if contactno bang muoi chu so
            }else if (editTextContactNo.getText().length() == 10){
                int firstPhone = Integer.parseInt(editTextContactNo.getText().toString().substring(0, 1));
                //if contactno bat dau bang so khong
                if (firstPhone != 0){
                    return "error";
                }
            }
        }
        return "true";
    }

    public void setDate(String string){
        edtDOB.setText(string);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_ungent_page, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
