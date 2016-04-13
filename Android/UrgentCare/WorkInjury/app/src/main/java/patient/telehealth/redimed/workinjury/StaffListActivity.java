package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.model.StaffModel;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.ListStaffAdapter;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class StaffListActivity extends AppCompatActivity implements View.OnClickListener {
    @Bind(R.id.btnBack) Button btnBack;
    @Bind(R.id.staffRecyclerView) RecyclerView staffRecyclerView;
    private String UserUid;
    private SharedPreferences workInjury;
    private ListStaffAdapter staffAdapter;
    private StaffModel[] data;
    private Gson gson;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_staff_list);
        ButterKnife.bind(this);
        btnBack.setOnClickListener(this);
        gson = new Gson();
        workInjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        UserUid = workInjury.getString("useruid", "");
        RESTClient.getCoreApi().getListStaff(UserUid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                data = gson.fromJson(jsonObject.get("data").toString(), StaffModel[].class);
//                for (UrgentRequestModel urgentRequestModel : data){
//                    Log.d("1111111111111111",urgentRequestModel.getDOB() + "");
//
//                }
                staffAdapter = new ListStaffAdapter(StaffListActivity.this,data);
                staffRecyclerView.setAdapter(staffAdapter);
                staffRecyclerView.setLayoutManager(new LinearLayoutManager(StaffListActivity.this));
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
                startActivity(new Intent(this, HomeActivity.class));
                finish();
                break;
        }
    }
}
