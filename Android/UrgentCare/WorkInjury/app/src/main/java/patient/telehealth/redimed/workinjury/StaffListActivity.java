package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.models.ModelStaff;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.staff.adapter.AdapterStaff;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class StaffListActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.btnBack) LinearLayout btnBack;
    @Bind(R.id.staffRecyclerView) RecyclerView staffRecyclerView;

    private String UserUid;
    private SharedPreferences workInjury;
    private AdapterStaff staffAdapter;
    private ModelStaff[] data;
    private Gson gson;
    private boolean work;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_staff_list);
        ButterKnife.bind(this);
        btnBack.setOnClickListener(this);
        gson = new Gson();
        workInjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        UserUid = workInjury.getString("useruid", "");
        Intent intent = getIntent();
        work = intent.getBooleanExtra("work",false);
        Log.d("ửokkkkkkkkkkkkkkkkkkk",work +"");
        RESTClient.getCoreApi().getListStaff(UserUid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                data = gson.fromJson(jsonObject.get("data").toString(), ModelStaff[].class);
                Log.d("eeeeeeee",jsonObject.get("data").toString());
//                for (UrgentRequestModel urgentRequestModel : data){
//                    Log.d("1111111111111111",urgentRequestModel.getDOB() + "");
//
//                }
                //staffAdapter = new AdapterStaff(StaffListActivity.this,data, );
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
                onBackPressed();
                break;
        }
    }
}
