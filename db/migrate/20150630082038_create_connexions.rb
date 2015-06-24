class CreateConnexions < ActiveRecord::Migration
  def change
    create_table :connexions do |t|
      t.integer :organization_id
      t.string :place
      t.string :ip
      t.integer :count, default: 0
      
      t.timestamps
    end
  end
end
