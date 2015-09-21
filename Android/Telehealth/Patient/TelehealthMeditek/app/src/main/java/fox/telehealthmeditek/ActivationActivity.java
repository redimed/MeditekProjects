package fox.telehealthmeditek;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.squareup.picasso.Picasso;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import fox.telehealthmeditek.animation.BlurTransformation;
import fox.telehealthmeditek.util.FontUtils;

public class ActivationActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.bgEnterPhone) ImageView backgroundEnterPhone;
    @Bind(R.id.btEnterPhone) Button btEnterPhone;
    @Bind(R.id.btPostCode) Button btPostCode;
    @Bind(R.id.etPhoneNumber) EditText etPhoneNumber;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_activation);
        ButterKnife.bind(this);

        Picasso.with(getApplicationContext()).load(R.drawable.background_home).transform(new BlurTransformation(getApplicationContext(),15)).into(backgroundEnterPhone);
        btEnterPhone.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btEnterPhone:
                CheckPhoneNumber();
                break;
        }
    }

    private void CheckPhoneNumber(){
//        String phoneExpression = "^\\({0,1}((0|\\+61)(2|4|3|7|8)){0,1}\\){0,1}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{1}(\\ |-){0,1}[0-9]{3}$";

        String phoneExpression = "^[0-9]{2}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{1}(\\ |-){0,1}[0-9]{3}$";
        Pattern pattern = Pattern.compile(phoneExpression);
        Matcher matcher = pattern.matcher(etPhoneNumber.getText());

        if (matcher.matches()){
            Intent i = new Intent(getApplicationContext(), VerifyCodeActivity.class);
            startActivity(i);
        }
        else {
            Toast.makeText(getApplicationContext(), "Phone Number Invalid", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_activation, menu);
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
