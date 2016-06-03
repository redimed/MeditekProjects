package patient.telehealth.redimed.workinjury;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.gson.JsonObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.api.UrgentRequest;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.PageIndicator;
import patient.telehealth.redimed.workinjury.utils.SliderImageAdapter;
import patient.telehealth.redimed.workinjury.utils.TypefaceUtil;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class HomeActivity111 extends AppCompatActivity implements View.OnClickListener {

    private String TAG = "HOME";
    private Intent i;
    private SliderImageAdapter sliderImageAdapter;
    private int currentItem = 0;
    private boolean shouldFinish = false;
    private UrgentRequest urgentRequestApi;
    private static SharedPreferences workinjury;
    private boolean isAuthenticated;
    private boolean isTypeCompany;
    private String UserUid;

    @Bind(R.id.slider) ViewPager slider;
    @Bind(R.id.circleIndicator) PageIndicator circleIndicator;
    @Bind(R.id.btnCall) Button btnCall;
    @Bind(R.id.btnFAQ) Button btnFAQ;
    @Bind(R.id.btnUrgentCare) Button btnUrgent;
    @Bind(R.id.btnRehab) Button btnRehab;
    @Bind(R.id.btnSpec) Button btnSpec;
    @Bind(R.id.btnGP) Button btnGP;
    @Bind(R.id.btnOther) Button btnOther;
    @Bind(R.id.btnLogin) Button btnLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home111);
        TypefaceUtil.applyFont(this, findViewById(R.id.activityHome), "fonts/Roboto-Regular.ttf");
        ButterKnife.bind(this);
        workinjury = getSharedPreferences("WorkInjury", MODE_PRIVATE);
        isTypeCompany = workinjury.getBoolean("isTypeCompany", false);
        if (isTypeCompany){
            btnLogin.setVisibility(View.GONE);
            UserUid = workinjury.getString("useruid","");
            RESTClient.getCoreApi().getDetailCompany(UserUid, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    Log.d("aaaaaaaa",jsonObject.get("data").getAsJsonArray()+"");
                    String companyUid = ((jsonObject.get("data").getAsJsonArray()).get(0).getAsJsonObject()).get("UID").getAsString();
                    String companyName = ((jsonObject.get("data").getAsJsonArray()).get(0).getAsJsonObject()).get("CompanyName").getAsString();
                    SharedPreferences.Editor editor = workinjury.edit();
                    editor.putString("companyUid",companyUid);
                    editor.putString("companyName",companyName);
                    editor.apply();
                }

                @Override
                public void failure(RetrofitError error) {

                }
            });
        }
        Log.d("huhuhuhuhu", String.valueOf(isAuthenticated));
        urgentRequestApi = RESTClient.getRegisterApi();
        sliderImageAdapter = new SliderImageAdapter(this);
        slider.setAdapter(sliderImageAdapter);
        circleIndicator.setViewPager(slider);

        final int totalPage = slider.getAdapter().getCount();
        final Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                circleIndicator.setCurrentItem(currentItem++);
                if (currentItem == totalPage) {
                    currentItem = 0;
                }
                handler.postDelayed(this, 4000);
            }
        };
        handler.postDelayed(runnable, 4000);

        CreateJsonDataSuburb();

        btnCall.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/Roboto-Regular.ttf"), Typeface.BOLD);
        btnFAQ.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/Roboto-Regular.ttf"), Typeface.BOLD);
        btnUrgent.setTypeface(Typeface.createFromAsset(getAssets(), "fonts/Roboto-Regular.ttf"), Typeface.BOLD);

        btnCall.setOnClickListener(this);
        btnFAQ.setOnClickListener(this);
        btnUrgent.setOnClickListener(this);
        btnRehab.setOnClickListener(this);
        btnSpec.setOnClickListener(this);
        btnGP.setOnClickListener(this);
        btnOther.setOnClickListener(this);
        btnLogin.setOnClickListener(this);
    }

    //CreateJsonDataSuburb : if suburb.json file not exists then create file suburb.json
    public void CreateJsonDataSuburb() {
        File file = new File(
                "/data/data/" + getApplicationContext().getPackageName() + "/" +
                        getResources().getString(R.string.fileName)
        );

        if (!file.exists()) {
            urgentRequestApi.getListSuburb(new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    Log.d(TAG, "=========Success===========");
                    try {
                        FileWriter file = new FileWriter(
                                "/data/data/" + getApplicationContext().getPackageName() + "/" +
                                        getResources().getString(R.string.fileName)
                        );
                        file.write(String.valueOf(jsonObject));
                        file.flush();
                        file.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    Log.d(TAG, error.getLocalizedMessage());
                }
            });
        }
    }

    private void Contact() {
        Uri call = Uri.parse("tel:" + getResources().getString(R.string.phone_call));
        Intent phoneCallIntent = new Intent(Intent.ACTION_CALL, call);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
                startActivity(phoneCallIntent);
                return;
            }
        }
        startActivity(phoneCallIntent);
    }

    @Override
    public void onBackPressed() {
        if (!shouldFinish) {
            Toast.makeText(this, R.string.confirm_exit, Toast.LENGTH_SHORT).show();
            shouldFinish = true;
        }else finish();

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnCall:
                Contact();
                break;
            case R.id.btnFAQ:
                i = new Intent(this, FAQsActivity.class);
                i.putExtra("doc", "faq");
                startActivity(i);
                finish();
                break;
            case R.id.btnUrgentCare:
                i = new Intent(this, FAQsActivity.class);
                i.putExtra("doc", "urgent");
                startActivity(i);
                finish();
                break;
            case R.id.btnOther:
                i = new Intent(this, SettingActivity.class);
                startActivity(i);
                finish();
                break;
            case R.id.btnRehab:
                i = new Intent(this, WorkActivity.class);
                i.putExtra("URType", "rehab");
                startActivity(i);
                finish();
                break;
            case R.id.btnSpec:
                i = new Intent(this, WorkActivity.class);
                i.putExtra("URType", "specialist");
                startActivity(i);
                finish();
                break;
            case R.id.btnGP:
                i = new Intent(this, WorkActivity.class);
                i.putExtra("URType", "gp");
                startActivity(i);
                finish();
                break;
            case  R.id.btnLogin:
                startActivity(new Intent(getApplicationContext(), LoginActivity.class));
                finish();
                break;
        }
    }
}
