package patient.telehealth.redimed.sportinjury;

import android.content.Intent;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Environment;
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
import patient.telehealth.redimed.sportinjury.api.UrgentRequest;
import patient.telehealth.redimed.sportinjury.network.RESTClient;
import patient.telehealth.redimed.sportinjury.utils.PageIndicator;
import patient.telehealth.redimed.sportinjury.utils.SliderImageAdapter;
import patient.telehealth.redimed.sportinjury.utils.TypefaceUtil;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class HomeActivity extends AppCompatActivity implements View.OnClickListener {

    private String TAG = "HOME";
    private Intent i;
    private SliderImageAdapter sliderImageAdapter;
    private int currentItem = 0;
    private boolean shouldFinish = false;
    private UrgentRequest urgentRequestApi;

    @Bind(R.id.slider)
    ViewPager slider;
    @Bind(R.id.circleIndicator)
    PageIndicator circleIndicator;
    @Bind(R.id.btnCall)
    Button btnCall;
    @Bind(R.id.btnFAQ)
    Button btnFAQ;
    @Bind(R.id.btnUrgentCare)
    Button btnUrgent;
    @Bind(R.id.btnPhy)
    Button btnPhy;
    @Bind(R.id.btnSpec)
    Button btnSpec;
    @Bind(R.id.btnGen)
    Button btnGen;
    @Bind(R.id.btnHand)
    Button btnHand;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        TypefaceUtil.applyFont(this, findViewById(R.id.activityHome), "fonts/Roboto-Regular.ttf");
        ButterKnife.bind(this);
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
        btnPhy.setOnClickListener(this);
        btnSpec.setOnClickListener(this);
        btnGen.setOnClickListener(this);
        btnHand.setOnClickListener(this);
    }

    //CreateJsonDataSuburb : if suburb.json file not exists then create file suburb.json
    public void CreateJsonDataSuburb() {
        File file = new File(
                "/data/data/" + getApplicationContext().getPackageName() + "/" +
                        getResources().getString(R.string.fileName)
        );

        if(!file.exists()){
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
            case R.id.btnPhy:
                i = new Intent(this, SportActivity.class);
                i.putExtra("URType", "phy");
                startActivity(i);
                finish();
                break;
            case R.id.btnSpec:
                i = new Intent(this, SportActivity.class);
                i.putExtra("URType", "spec");
                startActivity(i);
                finish();
                break;
            case R.id.btnGen:
                i = new Intent(this, SportActivity.class);
                i.putExtra("URType", "gen");
                startActivity(i);
                finish();
                break;
            case R.id.btnHand:
                i = new Intent(this, SportActivity.class);
                i.putExtra("URType", "hand");
                startActivity(i);
                finish();
                break;
        }
    }

    private void Contact() {
        String number = "+841267146714";
        Uri call = Uri.parse("tel:" + number);
        Intent phoneCallIntent = new Intent(Intent.ACTION_CALL, call);
        startActivity(phoneCallIntent);
    }

    @Override
    public void onBackPressed() {
        if (!shouldFinish) {
            Toast.makeText(this, R.string.confirm_exit, Toast.LENGTH_SHORT).show();
            shouldFinish = true;
        }else finish();

    }
}
