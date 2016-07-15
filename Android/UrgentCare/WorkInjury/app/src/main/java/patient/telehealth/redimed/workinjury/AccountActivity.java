package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.models.AccountModel;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class AccountActivity extends AppCompatActivity implements View.OnClickListener {
    @Bind(R.id.btnBack) LinearLayout btnBack;
    @Bind(R.id.fullName) TextView fullName;
    @Bind(R.id.booking) TextView booking;
    @Bind(R.id.email) TextView email;
    @Bind(R.id.phone) TextView phone;
    private SharedPreferences workInjury;
    private Gson gson;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account);
        ButterKnife.bind(this);
        btnBack.setOnClickListener(this);
        gson = new Gson();
        workInjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        RESTClient.getCoreApi().getDetailUser(workInjury.getString("useruid", ""), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                AccountModel model = gson.fromJson(jsonObject, AccountModel.class);
                fullName.setText(model.getUserName());
                booking.setText(model.getUserType());
                email.setText(model.getEmail());
                phone.setText(model.getPhoneNumber());
            }

            @Override
            public void failure(RetrofitError error) {

            }
        });

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnBack:
                startActivity(new Intent(this,SettingActivity.class));
                finish();
                break;
        }
    }
}
