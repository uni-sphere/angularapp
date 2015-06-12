class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :subdomain
      t.string :latitude
			t.string :longitude
      t.string :place_id
      t.string :website
      
      t.timestamps
    end
  end
end