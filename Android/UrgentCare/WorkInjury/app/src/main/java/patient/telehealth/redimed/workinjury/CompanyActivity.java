package patient.telehealth.redimed.workinjury;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.models.ModelSite;

public class CompanyActivity extends AppCompatActivity implements View.OnClickListener {
    @Bind(R.id.btnBack) LinearLayout btnBack;
    @Bind(R.id.siteName) TextView siteName;
    @Bind(R.id.address) TextView address;
    @Bind(R.id.suburb) TextView suburb;
    @Bind(R.id.postcode) TextView postcode;
    @Bind(R.id.state) TextView state;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_company);
        ButterKnife.bind(this);
        btnBack.setOnClickListener(this);

        Intent intent = getIntent();
        if (intent != null){
            ModelSite modelSite = intent.getExtras().getParcelable("site");
            Log.d("Intent",  modelSite.getSiteName()+ "");
            siteName.setText(modelSite.getSiteName());
            address.setText(modelSite.getAddress1());
            suburb.setText(modelSite.getSuburb());
            postcode.setText(modelSite.getPostcode());
            state.setText(modelSite.getState());
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnBack:
                startActivity(new Intent(this, SiteListActivity.class));
                finish();
                break;
        }
    }
}
