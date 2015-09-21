package fox.telehealthmeditek;

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

import com.squareup.picasso.Picasso;

import butterknife.Bind;
import butterknife.ButterKnife;
import fox.telehealthmeditek.animation.BlurTransformation;

public class VerifyCodeActivity extends AppCompatActivity implements View.OnClickListener, TextWatcher {

    @Bind(R.id.bgVerifyPhone)
    ImageView backgroundVerifyPhone;
    @Bind(R.id.btnVerifyPhone)
    Button btnVerifyPhone;
    @Bind(R.id.etCode)
    EditText etCode;
    @Bind(R.id.etCode2)
    EditText etCode2;
    @Bind(R.id.etCode3)
    EditText etCode3;
    @Bind(R.id.etCode4)
    EditText etCode4;
    int count = 0;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_verify_code);
        ButterKnife.bind(this);

        Picasso.with(getApplicationContext()).load(R.drawable.background_home).transform(new BlurTransformation(getApplicationContext(),15)).into(backgroundVerifyPhone);
        btnVerifyPhone.setOnClickListener(this);
        etCode.addTextChangedListener(this);
        etCode2.addTextChangedListener(this);
        etCode3.addTextChangedListener(this);
        etCode4.addTextChangedListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnVerifyPhone:
                CheckVerifyCode();
                break;
        }
    }

    private void CheckVerifyCode(){
        String verifyCode = etCode.getText().toString() + etCode2.getText().toString() + etCode3.getText().toString() + etCode4.getText().toString();
        if (verifyCode.equals("1234")){
            Intent i = new Intent(getApplicationContext(),HomeActivity.class);
            startActivity(i);
        }
        else {
            count++;
            Toast.makeText(getApplicationContext(),"Code Invalid", Toast.LENGTH_SHORT).show();
            etCode.getText().clear();
            etCode2.getText().clear();
            etCode3.getText().clear();
            etCode4.getText().clear();
            etCode.setFocusableInTouchMode(true);
            etCode.requestFocus();
            if (count == 2){
                Toast.makeText(getApplicationContext(),"Code will sent request again. Please wail a minutes", Toast.LENGTH_LONG).show();
            }
        }
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


    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
        if (etCode.getText().toString().length() == 1){
            etCode2.requestFocus();
            if (etCode2.getText().toString().length() == 1){
                etCode3.requestFocus();
                if (etCode3.getText().toString().length() == 1){
                    etCode4.requestFocus();
                }
            }
        }
    }

    @Override
    public void afterTextChanged(Editable s) {

    }
}
