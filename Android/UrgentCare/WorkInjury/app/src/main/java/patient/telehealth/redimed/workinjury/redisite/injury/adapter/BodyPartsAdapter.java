package patient.telehealth.redimed.workinjury.redisite.injury.adapter;

import android.content.Context;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;
import patient.telehealth.redimed.workinjury.utils.GridItemView;

/**
 * Created by MeditekMini on 6/13/16.
 */
public class BodyPartsAdapter extends BaseAdapter {

    private Context context;
    private List<String> bodyParts;
    private FragmentActivity activity;
    private List<TempDataBean> injuryBodyPart;
    private static final String TAG = "=BODY_ADAPTER=";

    public List<Integer> selectedPositions;

    protected MyApplication application;

    public BodyPartsAdapter(Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.application = (MyApplication) context.getApplicationContext();

        selectedPositions = new ArrayList<>();
        injuryBodyPart = application.getInjuryBodyPart();
        bodyParts = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.body_parts_arrays)));

        if (injuryBodyPart.size() == 0){
            application.setInjuryBodyPart(application.EformCheckbox("part1", "row_2_9", "yes", "false", "field_2_9_0"));
            application.setInjuryBodyPart(application.EformCheckbox("part2", "row_2_9", "yes", "false", "field_2_9_1"));
            application.setInjuryBodyPart(application.EformCheckbox("part3", "row_2_9", "yes", "false", "field_2_9_2"));
            application.setInjuryBodyPart(application.EformCheckbox("part4", "row_2_10", "yes", "false", "field_2_10_0"));
            application.setInjuryBodyPart(application.EformCheckbox("part5", "row_2_10", "yes", "false", "field_2_10_1"));
            application.setInjuryBodyPart(application.EformCheckbox("part6", "row_2_10", "yes", "false", "field_2_10_2"));
            application.setInjuryBodyPart(application.EformCheckbox("part7", "row_2_11", "yes", "false", "field_2_11_0"));
            application.setInjuryBodyPart(application.EformCheckbox("part8", "row_2_11", "yes", "false", "field_2_11_1"));
            application.setInjuryBodyPart(application.EformCheckbox("part9", "row_2_11", "yes", "false", "field_2_11_2"));
            application.setInjuryBodyPart(application.EformCheckbox("part10", "row_2_12", "yes", "false", "field_2_12_0"));
            application.setInjuryBodyPart(application.EformCheckbox("part11", "row_2_12", "yes", "false", "field_2_12_1"));
            application.setInjuryBodyPart(application.EformCheckbox("part12", "row_2_12", "yes", "false", "field_2_12_2"));
            application.setInjuryBodyPart(application.EformCheckbox("part13", "row_2_13", "yes", "false", "field_2_13_0"));
            application.setInjuryBodyPart(application.EformCheckbox("part14", "row_2_13", "yes", "false", "field_2_13_1"));
            application.setInjuryBodyPart(application.EformCheckbox("part15", "row_2_13", "yes", "false", "field_2_13_1"));
        }
    }

    @Override
    public int getCount() {
        return bodyParts.size();
    }

    @Override
    public Object getItem(int position) {
        return bodyParts.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        GridItemView bodyPartsAdapter = (convertView == null) ? new GridItemView(activity) : (GridItemView) convertView;

       if (injuryBodyPart.get(position).getChecked().equalsIgnoreCase("true")) {
           selectedPositions.add(position);
           bodyPartsAdapter.display(bodyParts.get(position), true);
       } else {
           bodyPartsAdapter.display(bodyParts.get(position), false);
       }
        return bodyPartsAdapter;
    }
}
