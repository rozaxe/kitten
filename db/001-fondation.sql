-- kitties
CREATE TABLE kitties (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    archived BOOLEAN DEFAULT FALSE
);
ALTER TABLE kitties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual read access" ON kitties FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert access" ON kitties FOR INSERT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual update access" ON kitties FOR UPDATE USING (auth.uid() = user_id);

-- savings
CREATE TABLE savings (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL,
    kitty_id UUID NOT NULL REFERENCES kitties(id),
    amount BIGINT NOT NULL,
    date DATE NOT NULL
);
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual read access" ON savings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert access" ON savings FOR INSERT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual update access" ON savings FOR UPDATE USING (auth.uid() = user_id);

-- expenses
CREATE TABLE expenses (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL,
    kitty_id UUID NOT NULL REFERENCES kitties(id),
    memo VARCHAR(200) NOT NULL,
    amount BIGINT NOT NULL,
    date DATE NOT NULL
);
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual read access" ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert access" ON expenses FOR INSERT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual update access" ON expenses FOR UPDATE USING (auth.uid() = user_id);

-- funds
CREATE TABLE funds (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID NOT NULL,
    amount BIGINT NOT NULL,
    date DATE NOT NULL,
);
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual read access" ON funds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert access" ON funds FOR INSERT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual update access" ON funds FOR UPDATE USING (auth.uid() = user_id);
