package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;

import butterknife.Bind;
import butterknife.ButterKnife;

public class FAQsActivity extends AppCompatActivity {

    private Intent i;

    @Bind(R.id.webFAQs)
    WebView webViewFAQs;
    @Bind(R.id.btnBack)
    Button btnBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_faqs);
        ButterKnife.bind(this);
        String url = null;
        i = getIntent();
        if (i != null){
            if (i.getStringExtra("doc").equalsIgnoreCase("faq")){
               url  = "file:///android_asset/FAQs.html";
            }
            else if(i.getStringExtra("doc").equalsIgnoreCase("urgent")){
                url = "file:///android_asset/UrgentCare.html";
            }
            else {
                url = "file:///android_asset/OtherServices.html";
            }
        }
        WebSettings webSettings = webViewFAQs.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webViewFAQs.setBackgroundColor(Color.TRANSPARENT);
        webViewFAQs.setLayerType(WebView.LAYER_TYPE_SOFTWARE, null);
        webViewFAQs.loadUrl(url);

        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        startActivity(new Intent(this, HomeActivity.class));
        finish();
    }
}
