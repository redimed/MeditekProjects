package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class SettingActivity extends AppCompatActivity implements View.OnClickListener {
    @Bind(R.id.btnSetting) Button btnSetting;
    @Bind(R.id.btnStaffList) Button btnStaffList;
    @Bind(R.id.btnLogout) RelativeLayout btnLogout;
    @Bind(R.id.lblUserName) TextView lblUserName;
    @Bind(R.id.lblCompanyName) TextView lblCompanyName;
    private SharedPreferences workinjury;
    private String UserUid;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_setting);
        ButterKnife.bind(this);
        workinjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        lblUserName.setText(workinjury.getString("username","N/A"));
        lblCompanyName.setText("N/A");
        UserUid = workinjury.getString("useruid","null");
        if (!UserUid.equals("null")){
            Log.d(UserUid,UserUid);
            RESTClient.getCoreApi().getDetailCompany(UserUid, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {

                }

                @Override
                public void failure(RetrofitError error) {

                }
            });

            RESTClient.getCoreApi().getDetailUser(UserUid, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {

                }

                @Override
                public void failure(RetrofitError error) {

                }
            });

        };
        btnSetting.setOnClickListener(this);
        btnLogout.setOnClickListener(this);
        btnStaffList.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnSetting:
                startActivity(new Intent(this, HomeActivity.class));
                finish();
                break;
            case  R.id.btnLogout:
                RESTClient.getAuthApi().logout(new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        Log.d("Logout", String.valueOf(jsonObject));
                        SharedPreferences.Editor editor = workinjury.edit();
                        editor.clear();
                        editor.commit();
                        startActivity(new Intent(getApplicationContext(), HomeActivity.class));
                        finish();
                    }

                    @Override
                    public void failure(RetrofitError error) {

                    }
                });
                break;
            case  R.id.btnStaffList:
                startActivity(new Intent(this, StaffListActivity.class));
                finish();
                break;
        }
    }
}
