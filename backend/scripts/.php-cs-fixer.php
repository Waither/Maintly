<?php

/**
 * PHP CS Fixer Configuration
 * 
 * Style: Nawiasy na końcu linii (K&R style)
 * Standard: PSR-12 z customizacją
 */

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/../src')
    ->in(__DIR__ . '/../tests')
    ->exclude('var')
    ->exclude('vendor')
    ->name('*.php')
    ->notName('*.blade.php')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true);

return (new PhpCsFixer\Config())
    ->setRules([
        // ==========================================
        // PODSTAWOWY STANDARD
        // ==========================================
        '@PSR12' => true,
        '@Symfony' => true,
        
        // ==========================================
        // NAWIASY - TWÓJ STYL (na końcu linii)
        // ==========================================
        'braces_position' => [
            'functions_opening_brace' => 'same_line',              // function foo() {
            'classes_opening_brace' => 'same_line',                // class Foo {
            'anonymous_classes_opening_brace' => 'same_line',      // new class {
            'control_structures_opening_brace' => 'same_line',     // if ($x) {
            'anonymous_functions_opening_brace' => 'same_line',    // function() {
        ],

        // ==========================================
        // ELSE/CATCH W NOWEJ LINII
        // ==========================================
        'control_structure_continuation_position' => [
            'position' => 'next_line',
        ],
        
        // ==========================================
        // CUDZYSŁOWY I STRINGI
        // ==========================================
        'single_quote' => true,                    // 'string' zamiast "string"
        'string_implicit_backslashes' => false,    // Usuń niepotrzebne \ w stringach
        
        // ==========================================
        // ARRAY
        // ==========================================
        'array_syntax' => ['syntax' => 'short'],   // [] zamiast array()
        'trailing_comma_in_multiline' => [
            'elements' => ['arrays', 'arguments', 'parameters'],  // Dodaj , na końcu
        ],
        'no_trailing_comma_in_singleline' => true,  // Usuń , w jednolinijkowych
        'whitespace_after_comma_in_array' => true,
        
        // ==========================================
        // IMPORTY I NAMESPACE
        // ==========================================
        'ordered_imports' => [
            'sort_algorithm' => 'alpha',           // Sortuj alfabetycznie
            'imports_order' => ['class', 'function', 'const'],
        ],
        'no_unused_imports' => true,               // Usuń nieużywane use
        'global_namespace_import' => [
            'import_classes' => true,
            'import_constants' => false,
            'import_functions' => false,
        ],
        'single_line_after_imports' => true,       // Pusta linia po use
        
        // ==========================================
        // WHITESPACE I FORMATOWANIE
        // ==========================================
        'blank_line_after_opening_tag' => true,    // Pusta linia po <?php
        'blank_line_after_namespace' => true,      // Pusta linia po namespace
        'no_extra_blank_lines' => [
            'tokens' => [
                'extra',
                'throw',
                'use',
                'curly_brace_block',
            ],
        ],
        'no_trailing_whitespace' => true,          // Usuń spacje na końcu linii
        'no_whitespace_in_blank_line' => true,     // Puste linie bez spacji
        'indentation_type' => true,                // Spacje zamiast tabów
        'line_ending' => true,                     // Unix line endings (LF)
        
        // ==========================================
        // PHPDOC
        // ==========================================
        'phpdoc_align' => ['align' => 'left'],     // Nie wyrównuj PHPDoc
        'phpdoc_indent' => true,
        'phpdoc_inline_tag_normalizer' => true,
        'phpdoc_no_empty_return' => true,          // Usuń @return void
        'phpdoc_order' => true,                    // Sortuj @param, @return, @throws
        'phpdoc_scalar' => true,                   // int zamiast integer w PHPDoc
        'phpdoc_single_line_var_spacing' => true,
        'phpdoc_trim' => true,
        'phpdoc_types' => true,
        'phpdoc_var_without_name' => true,
        
        // ==========================================
        // STRICT TYPES
        // ==========================================
        'declare_strict_types' => false,           // NIE dodawaj declare(strict_types=1) automatycznie
        
        // ==========================================
        // FUNKCJE I METODY
        // ==========================================
        'method_argument_space' => [
            'on_multiline' => 'ensure_fully_multiline',
            'keep_multiple_spaces_after_comma' => false,
        ],
        'no_spaces_after_function_name' => true,   // foo() nie foo ()
        'function_typehint_space' => true,
        'return_type_declaration' => ['space_before' => 'none'], // function(): Type nie function() : Type
        'single_line_empty_body' => true,          // ) {} zamiast ) {\n}
        
        // ==========================================
        // OPERATORY
        // ==========================================
        'binary_operator_spaces' => [
            'default' => 'single_space',           // $a = $b + $c (ze spacjami)
        ],
        'concat_space' => ['spacing' => 'one'],    // $a . $b (ze spacją)
        'unary_operator_spaces' => true,           // $i++ nie $i ++
        
        // ==========================================
        // KONTROLA PRZEPŁYWU
        // ==========================================
        'no_alternative_syntax' => true,           // if () {} nie if (): endif;
        'no_superfluous_elseif' => true,           // Usuń zbędne elseif
        'simplified_if_return' => true,            // Uproszczony return w if
        'no_useless_else' => true,                 // Usuń zbędne else
        'no_useless_return' => true,               // Usuń zbędne return
        'switch_case_space' => true,               // Spacje w switch case
        'switch_case_semicolon_to_colon' => true,  // Zmiana ; na : w switch case

        // ==========================================
        // INNE
        // ==========================================
        'cast_spaces' => true,                     // (int) $foo nie (int)$foo
        'lowercase_cast' => true,                  // (int) nie (INT)
        'no_empty_statement' => true,              // Usuń puste ;
        'no_leading_import_slash' => true,         // use Foo nie use \Foo
        'no_singleline_whitespace_before_semicolons' => true,
        'echo_tag_syntax' => ['format' => 'short'], // <?= nie <?php echo
        'native_function_casing' => true,          // strtolower() nie strToLower()
        'native_function_type_declaration_casing' => true,
        'control_structure_braces' => true,
    ])
    ->setFinder($finder)
    ->setRiskyAllowed(false)  // Tylko bezpieczne reguły
    ->setUsingCache(true)     // Cache dla szybkości
    ->setCacheFile(__DIR__ . '/../var/cache/.php-cs-fixer.cache');
