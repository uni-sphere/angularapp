class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :token
      t.boolean :classes, default: fakse
			
      t.timestamps
    end
  end
end