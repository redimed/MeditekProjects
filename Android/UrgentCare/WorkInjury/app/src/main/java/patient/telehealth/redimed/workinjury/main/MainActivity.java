package patient.telehealth.redimed.workinjury.main;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.main.view.IMainView;

public class MainActivity extends AppCompatActivity implements IMainView{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MyApplication.getInstance().replaceFragment(this, new HomeFragment());
        setContentView(R.layout.activity_main);
    }

//    @Override
//    public void onBackPressed() {
//        super.onBackPressed();
//        if (getFragmentManager().getBackStackEntryCount() == 0) {
//            super.onBackPressed();
//        } else {
//            getFragmentManager().popBackStack();
//        }
//    }
}
