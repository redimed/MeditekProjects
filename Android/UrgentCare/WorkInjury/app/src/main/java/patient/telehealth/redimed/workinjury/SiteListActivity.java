package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.LinearLayout;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.models.ModelSite;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.site.adapter.AdapterSite;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class SiteListActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.btnBack)
    LinearLayout btnBack;
    @Bind(R.id.siteRecyclerView) RecyclerView siteRecyclerView;

    private SharedPreferences workInjury;
    private Gson gson;
    private ModelSite[] data;
    private AdapterSite siteAdapter;
    private boolean work;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_site_list);
        ButterKnife.bind(this);
        gson = new Gson();
        btnBack.setOnClickListener(this);
        workInjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        Intent intent = getIntent();
        work = intent.getBooleanExtra("work",false);
        RESTClient.getCoreApi().getListSite(workInjury.getString("companyUid",""), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                data = gson.fromJson(jsonObject.get("data").toString(), ModelSite[].class);
                siteRecyclerView.setAdapter(siteAdapter);
                siteRecyclerView.setLayoutManager(new LinearLayoutManager(SiteListActivity.this));
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
