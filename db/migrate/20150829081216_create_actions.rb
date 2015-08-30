class CreateActions < ActiveRecord::Migration
  def change
    create_table :actions do |t|
      t.integer :user_id
      t.integer :object_id
      t.integer :organization_id
      t.boolean :error, default: false
      t.string :user
      t.string :object
      t.string :type
      t.string :object_type
      
      t.timestamps
    end
  end
end
