package patient.telehealth.redimed.workinjury.staff.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.models.ModelStaff;

/**
 * Created by phanq on 04/13/2016.
 */
public class AdapterStaff extends RecyclerView.Adapter<AdapterStaff.StaffViewHolder> {

    private final LayoutInflater inflater;
    private ModelStaff[] data ;
    private Context context;
    private  OnClickStaff onClickStaff;

    public AdapterStaff(Context context, ModelStaff[] data, OnClickStaff onClickStaff){
       inflater = LayoutInflater.from(context);
        this.data = data;
        this.context = context;
        this.onClickStaff = onClickStaff;
    }

    @Override
    public StaffViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.staff_item, parent, false);
        StaffViewHolder viewHolder = new StaffViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(StaffViewHolder holder, int position) {
        String name = data[position].getFirstName() +" " +data[position].getLastName();
        holder.fullName.setText(name);
    }

    @Override
    public int getItemCount() {
        return data.length;
    }

    public class StaffViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        private TextView fullName;

        public StaffViewHolder(View itemView) {
            super(itemView);
            fullName = (TextView) itemView.findViewById(R.id.fullName);
            itemView.setClickable(true);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            String staffUid = data[getAdapterPosition()].getUID();
            onClickStaff.StaffItemClick(staffUid);

//            Intent intent = new Intent(context, WorkActivity.class);
//            intent.putExtra("staff", data[getAdapterPosition()]);
//            intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
//            context.startActivity(intent);
        }
    }

    public interface OnClickStaff {
        void StaffItemClick(String UID);
    }
}


