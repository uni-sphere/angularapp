class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :subdomain
      t.float :latitude
			t.float :longitude
      t.string :place_id
      
      t.timestamps
    end
  end
end