package patient.telehealth.redimed.workinjury.utils;

import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.WorkActivity;
import patient.telehealth.redimed.workinjury.model.StaffModel;

/**
 * Created by phanq on 04/13/2016.
 */
public class ListStaffAdapter extends RecyclerView.Adapter<ListStaffAdapter.StaffViewHolder> {

    private final LayoutInflater inflater;
    private StaffModel[] data ;
    private boolean work;
    private Context context;

    public ListStaffAdapter(Context context, StaffModel[] data, boolean work){
       inflater = LayoutInflater.from(context);
        this.data = data;
        this.work = work;
        this.context = context;
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

    class StaffViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        TextView fullName;
        public StaffViewHolder(View itemView) {
            super(itemView);
            fullName = (TextView) itemView.findViewById(R.id.fullName);
            itemView.setClickable(true);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            if (work){
                Intent intent = new Intent(context, WorkActivity.class);
                intent.putExtra("staff", data[getAdapterPosition()]);
                intent.setFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
                context.startActivity(intent);
            }
        }
    }
}
