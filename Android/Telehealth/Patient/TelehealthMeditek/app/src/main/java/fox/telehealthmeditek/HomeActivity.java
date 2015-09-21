package fox.telehealthmeditek;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;

import butterknife.Bind;
import butterknife.ButterKnife;

public class HomeActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.homeContent)
    TextView homeContent;
    @Bind(R.id.homeTitle)
    TextView homeTitle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        ButterKnife.bind(this);

        homeContent.setText("Our Telehealth service forms one part of an integrated Injury Management system. " +
                "Telehealth is an extremely cost effective way of accessing medical treatment for remote workers.");
        homeContent.setTextColor(getResources().getColor(R.color.text_primary));
        homeContent.setTextSize(R.dimen.primaryText);
        homeTitle.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.homeTitle:
                DisplayCall();
                break;
        }
    }

    private void DisplayCall() {
        Intent i = new Intent(getApplicationContext(), CallActivity.class);
        startActivity(i);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_home, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }


}
