package patient.telehealth.redimed.workinjury.redisite.image.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;

import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.CustomGallery;

/**
 * Created by MeditekPro on 7/1/16.
 */
public class ImageAdapter extends BaseAdapter {

    private Context context;
    private LayoutInflater inflater;
    private ArrayList<CustomGallery> customGalleries;

    public ImageAdapter(Context context, ArrayList<CustomGallery> customGalleries) {
        this.context = context;
        this.customGalleries = customGalleries;

        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public int getCount() {
        return customGalleries.size();
    }

    @Override
    public Object getItem(int i) {
        return customGalleries.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        final ViewHolder holder;
        if (view == null) {
            view = inflater.inflate(R.layout.gridview_item_image, null);

            holder = new ViewHolder();
            holder.imgQueue = (ImageView) view.findViewById(R.id.imgQueue);

            view.setTag(holder);
        } else {
            holder = (ViewHolder) view.getTag();
        }
        try {
            Glide.with(context).load("file://" + customGalleries.get(i).sdcardPath)
                    .centerCrop()
                    .into(holder.imgQueue);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return view;
    }

    public class ViewHolder {
        ImageView imgQueue;
    }
}
