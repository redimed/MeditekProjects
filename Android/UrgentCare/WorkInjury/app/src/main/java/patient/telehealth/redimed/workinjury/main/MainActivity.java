package patient.telehealth.redimed.workinjury.main;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.main.view.IMainView;
import patient.telehealth.redimed.workinjury.utils.Key;

public class MainActivity extends AppCompatActivity implements IMainView{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        MyApplication.getInstance().replaceFragment(this, new HomeFragment(), Key.fmHome,null);
    }

    @Override
    public void onBackPressed() {
        if (getFragmentManager().getBackStackEntryCount() == 0) {
            super.onBackPressed();
        } else {
            getFragmentManager().popBackStack();
        }
    }
}
