package patient.telehealth.redimed.workinjury.main;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.main.view.IMainView;
import patient.telehealth.redimed.workinjury.utils.Key;
public class MainActivity extends AppCompatActivity implements IMainView{

    private MyApplication application;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        application = MyApplication.getInstance();
        application.setCurrentActivity(this);
        application.replaceFragment(this, new HomeFragment(), Key.fmHome,null);
        //star service socket
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
