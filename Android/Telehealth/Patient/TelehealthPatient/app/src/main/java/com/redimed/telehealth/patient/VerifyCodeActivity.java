package com.redimed.telehealth.patient;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;

public class VerifyCodeActivity extends AppCompatActivity implements View.OnClickListener, TextWatcher {

    @Bind(R.id.imageVerifyPhone) ImageView imageVerifyPhone;
    @Bind(R.id.btnVerifyPhone) Button btnVerifyPhone;
    @Bind(R.id.txtCode) EditText txtCode;
    @Bind(R.id.txtCode2) EditText txtCode2;
    @Bind(R.id.txtCode3) EditText txtCode3;
    @Bind(R.id.txtCode4) EditText txtCode4;
    int count = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_verify_code);
        ButterKnife.bind(this);

        Picasso.with(getApplicationContext()).load(R.drawable.bg_activation).transform(new BlurTransformation(getApplicationContext(),15)).into(imageVerifyPhone);
        btnVerifyPhone.setOnClickListener(this);
        txtCode.addTextChangedListener(this);
        txtCode2.addTextChangedListener(this);
        txtCode3.addTextChangedListener(this);
        txtCode4.addTextChangedListener(this);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_verify_code, menu);
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

    //Event click button
    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnVerifyPhone:
                CheckVerifyCode();
                break;
        }
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    //Focus edit text next to other edit text when text changed
    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
        if (txtCode.getText().toString().length() == 1){
            txtCode2.requestFocus();
            if (txtCode2.getText().toString().length() == 1){
                txtCode3.requestFocus();
                if (txtCode3.getText().toString().length() == 1){
                    txtCode4.requestFocus();
                }
            }
        }
    }

    @Override
    public void afterTextChanged(Editable s) {

    }

    //Validate code when receive code from server
    private void CheckVerifyCode(){
        String verifyCode = txtCode.getText().toString() + txtCode2.getText().toString() + txtCode3.getText().toString() + txtCode4.getText().toString();
        if (verifyCode.equals("1234")){
            Intent i = new Intent(getApplicationContext(),HomeActivity.class);
            startActivity(i);
        }
        else {
            count++;
            Toast.makeText(getApplicationContext(), R.string.code_invalid, Toast.LENGTH_SHORT).show();
            txtCode.getText().clear();
            txtCode2.getText().clear();
            txtCode3.getText().clear();
            txtCode4.getText().clear();
            txtCode.setFocusableInTouchMode(true);
            txtCode.requestFocus();
            if (count == 2){
                Toast.makeText(getApplicationContext(), R.string.code_sent_request_again, Toast.LENGTH_LONG).show();
            }
        }
    }
}
